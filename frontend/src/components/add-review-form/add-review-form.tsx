import { useState } from 'react';
import Rating from '../rating/rating';
import { NewReview } from '../../types/new-review';

const Limit = {
  MIN: 50,
  MAX: 300,
};

type AddReviewFormProps = {
  onSubmit: (review: NewReview) => void;
};

function AddReviewForm({ onSubmit }: AddReviewFormProps) {
  const [filmRating, setRating] = useState<number>(0);
  const [text, setComment] = useState<string>('');

  const isValid =
  filmRating && text.length >= Limit.MIN && text.length <= Limit.MAX;

  return (
    <div className="add-review">
      <form
        action="#"
        className="add-review__form"
        onSubmit={(evt) => {
          evt.preventDefault();
          onSubmit({ filmRating, text });
        }}
      >
        <Rating onChange={setRating} currentRating={filmRating} />

        <div className="add-review__text">
          <textarea
            className="add-review__textarea"
            name="review-text"
            id="review-text"
            placeholder="Review text"
            value={text}
            onChange={(evt) => setComment(evt.target.value)}
          >
          </textarea>
          <div className="add-review__submit">
            <button
              className="add-review__btn"
              type="submit"
              disabled={!isValid}
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddReviewForm;
