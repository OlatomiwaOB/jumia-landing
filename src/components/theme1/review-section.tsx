import { Star } from "lucide-react";

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      rating: 5,
      text: "I absolutely love the quality! The FLUCÉ smartphone exceeded my expectations. Fast shipping and amazing customer service.",
      author: "Sarah M.",
    },
    {
      id: 2,
      rating: 5,
      text: "Best electronics store I've ever shopped from. The CLJ Studio headphones are incredible - the sound quality is unmatched!",
      author: "James K.",
    },
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">CUSTOMER FEEDBACK</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card p-6 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{review.text}</p>
              <p className="font-semibold">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
