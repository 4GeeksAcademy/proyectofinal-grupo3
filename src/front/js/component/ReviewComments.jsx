import React from 'react';

const ReviewComments = ({ reviews_comments }) => {
    return (
        <div className="mt-4">
            <h3 className="text-center gradient-text fw-bold">Testimonios de los pacientes:</h3>
            <div className="row justify-content-between">
                {reviews_comments.map((comment, index) => (
                    <div key={index} className="col-md-4 my-3">
                        <div className="card card-reviews">
                            <div className="card-body d-flex align-items-center">
                                <img
                                    src="https://i.pinimg.com/originals/df/5f/5b/df5f5b1b174a2b4b6026cc6c8f9395c1.jpg"
                                    alt="reviews_pacientes"
                                    className="size_img_reviews me-2"
                                />
                                <div>
                                    <span className="card-text">{comment.comentario}</span>
                                    <h6 className="card-title">{comment.patient_nombre}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewComments;
