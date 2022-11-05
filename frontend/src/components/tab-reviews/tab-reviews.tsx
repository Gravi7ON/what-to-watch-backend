import { useEffect } from 'react';
import Spinner from '../spinner/spinner';
import { getReviews, getIsLoading } from '../../store/reviews-data/selectors';
import { fetchReviews } from '../../store/api-actions';
import { useAppSelector, useAppDispatch } from '../../hooks/';
import { formatReviewDate } from '../../util';

type TabReviewsProps = {
  id: string;
};

function TabReviews({ id }: TabReviewsProps) {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(getReviews);
  const isLoading = useAppSelector(getIsLoading);

  useEffect(() => {
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="film-card__reviews film-card__row">
      <div className="film-card__reviews-col">
        {reviews.map(({ text, userId, publishDate, filmRating, filmId: reviewId }, index) => (
          <div key={`${reviewId}${index++}`} className="review">
            <blockquote className="review__quote">
              <p className="review__text">{text}</p>

              <footer className="review__details">
                <cite className="review__author">{userId}</cite>
                <time className="review__date" dateTime={publishDate}>
                  {formatReviewDate(publishDate)}
                </time>
              </footer>
            </blockquote>

            <div className="review__rating">{filmRating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabReviews;
