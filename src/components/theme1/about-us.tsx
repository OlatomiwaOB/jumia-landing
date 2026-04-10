const AboutSection = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8">ABOUT US</h2>
        <div className="prose prose-lg mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            We are a team of passionate technology enthusiasts dedicated to bringing you the latest and greatest in consumer electronics. Our curated selection features premium smartphones, audio equipment, and computing devices from both established brands and innovative newcomers.
          </p>
          <p className="text-muted-foreground">
            With over a decade of experience in the tech retail industry, we pride ourselves on offering not just products, but exceptional customer service and expert advice. Every item in our store is carefully selected to meet our high standards for quality, performance, and value.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
