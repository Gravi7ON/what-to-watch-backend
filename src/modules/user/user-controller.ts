import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component-types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-methods.enum.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import HttpError from '../../common/error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO, createJWT } from '../../utils/common.js';
import UserResponse from './response/user-response.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.js';
import { JWT_ALGORITM } from './user-constant.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
  }

  public async checkAuthenticate(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.user.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(
      res,
      fillDTO(UserResponse, user)
    );
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Пользователь с таким email «${body.email}» уже существует.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));

    this.created(
      res,
      fillDTO(UserResponse, result)
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('JWT_SECRET'),
      {email: user.email, id: user.id}
    );

    this.ok(res, {
      ...fillDTO(UserResponse, user),
      token
    });
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploaFile = {
      id: userId,
      avatar: req.file?.filename
    };
    await this.userService.updateById(userId, uploaFile);
    this.created(
      res,
      fillDTO(UserResponse, uploaFile)
    );
  }
}
