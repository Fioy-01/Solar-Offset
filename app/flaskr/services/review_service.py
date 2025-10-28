# review_service.py

class ReviewService:
    # 模拟一个存储评论的列表
    reviews = []

    @staticmethod
    def get_reviews(product):
        # 返回特定产品的所有评论
        return [review for review in ReviewService.reviews if review['product'] == product]

    @staticmethod
    def create_review(username, rating, content, product, user_id):
        # 构造评论对象
        review = {
            'username': username,
            'rating': rating,
            'content': content,
            'product': product,
            'userId': user_id
        }
        # 存入模拟数据库（内存列表）
        ReviewService.reviews.append(review)

        return {
            'status': 'ok',
            'message': 'Review submitted successfully',
            'review': review
        }
