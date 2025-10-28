import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Rate, Typography, Button, Modal, Input } from 'antd';

const { Title, Paragraph } = Typography;

const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    username: '',
    rating: 0,
    content: '',
  });

  useEffect(() => {
    fetch('/api/reviews?product=general')
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  const handleSubmitReview = async () => {
    const reviewToAdd = {
      ...newReview,
      product: 'general',
      userId: 'user-001', 
    };
  
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewToAdd),
      });
  
      const result = await response.json();
      if (response.ok) {
        setReviews([...reviews, { ...reviewToAdd, date: new Date().toISOString().split('T')[0] }]);
        setNewReview({ username: '', rating: 0, content: '' });
        setReviewModalVisible(false);
      } else {
        console.error(result);
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };


  return (
    <div style={{ backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Customer Reviews</Title>
      <Paragraph style={{ maxWidth: 800, margin: '0 auto' }}>
        Below are some customer reviews for your reference.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 32, maxWidth: 1200, margin: '0 auto' }}>
        {reviews.map((review, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card style={{ textAlign: 'left', padding: '20px' }}>
              <Paragraph><b>{review.username || 'Anonymous'}</b> – {review.date}</Paragraph>
              <Rate disabled defaultValue={review.rating} />
              <Paragraph>{review.content}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Button type="primary" onClick={() => setReviewModalVisible(true)}>
          Write a Review
        </Button>
      </div>

      <Modal
        title="Write a Review"
        open={reviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => setReviewModalVisible(false)}
        okText="Submit"
      >
        <Input
          placeholder="Your Name (optional)"
          value={newReview.username}
          onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
          style={{ marginBottom: 12 }}
        />
        <Rate
          value={newReview.rating}
          onChange={(value) => setNewReview({ ...newReview, rating: value })}
          style={{ marginBottom: 12 }}
        />
        <Input.TextArea
          placeholder="Write your review here"
          rows={4}
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default ReviewSection;
