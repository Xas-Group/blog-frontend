import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Section, SectionHeader } from "../Components/Section";
import FeatureCard from "../Components/CardComponent";
import PageBackground from "../Components/PageBackground";
import { H1, P } from "../Components/Typography";
import StyledButton from "../Components/Button";
import { useNavigate } from "react-router-dom";

function LandingPage() {

    const navigate = useNavigate();

     const handleStartLearning = () => {
       navigate("/learn"); // Redirect to the '/learn' page
     };


  return (
    <PageBackground
      className="pt-5"
      color="linear-gradient(to right, #f8f9fa, #e9ecef)"
    >
      <Container>
        {/* Hero Section */}
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <H1>Welcome to Your IT & Business Learning Hub</H1>
            <P>
              Explore articles, guides, and tutorials from basics to advanced
              topics in IT and Business. Kickstart your journey towards
              knowledge and success.
            </P>
            <StyledButton onClick={handleStartLearning}>
              Start Learning Now
            </StyledButton>
          </Col>
        </Row>

        {/* Features Section */}
        <Section>
          <SectionHeader>Featured Content</SectionHeader>
          <Row>
            <Col md={4}>
              <FeatureCard>
                <Card.Body>
                  <Card.Title>IT Fundamentals</Card.Title>
                  <Card.Text>
                    Understand the basics of IT, including programming,
                    networking, and system administration.
                  </Card.Text>
                </Card.Body>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <Card.Body>
                  <Card.Title>Business Strategies</Card.Title>
                  <Card.Text>
                    Dive into business strategies, management principles, and
                    entrepreneurship tips to excel in the business world.
                  </Card.Text>
                </Card.Body>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <Card.Body>
                  <Card.Title>Advanced Learning</Card.Title>
                  <Card.Text>
                    Move to advanced topics like cloud computing, AI, financial
                    analysis, and market trends for deeper insights.
                  </Card.Text>
                </Card.Body>
              </FeatureCard>
            </Col>
          </Row>
        </Section>

        {/* Latest Articles Section */}
        <Section>
          <SectionHeader>Latest Articles</SectionHeader>
          <Row>
            <Col md={4}>
              <FeatureCard>
                <Card.Img variant="top" src="https://placehold.co/300x200" />
                <Card.Body>
                  <Card.Title>Beginner's Guide to Programming</Card.Title>
                  <Card.Text>
                    A comprehensive guide to help you start your coding journey.
                  </Card.Text>
                </Card.Body>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <Card.Img variant="top" src="https://placehold.co/300x200" />
                <Card.Body>
                  <Card.Title>Effective Business Planning</Card.Title>
                  <Card.Text>
                    Tips and tricks to create effective business plans for
                    startups and enterprises.
                  </Card.Text>
                </Card.Body>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <Card.Img variant="top" src="https://placehold.co/300x200" />
                <Card.Body>
                  <Card.Title>Advanced AI Concepts</Card.Title>
                  <Card.Text>
                    Delve into advanced AI concepts for better tech solutions.
                  </Card.Text>
                </Card.Body>
              </FeatureCard>
            </Col>
          </Row>
        </Section>

        {/* Testimonials Section */}
        <Section>
          <SectionHeader>What Our Readers Say</SectionHeader>
          <Row>
            <Col md={4}>
              <FeatureCard>
                <Card.Body>
                  <Card.Text>
                    "This blog has been incredibly helpful in advancing my
                    programming skills."
                  </Card.Text>
                  <Card.Footer>- John Doe, Software Engineer</Card.Footer>
                </Card.Body>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <Card.Body>
                  <Card.Text>
                    "A go-to resource for anyone wanting to learn business
                    strategies."
                  </Card.Text>
                  <Card.Footer>- Jane Smith, Entrepreneur</Card.Footer>
                </Card.Body>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <Card.Body>
                  <Card.Text>
                    "The articles are well-written and cover the basics to
                    advanced topics perfectly."
                  </Card.Text>
                  <Card.Footer>- Alex Brown, IT Consultant</Card.Footer>
                </Card.Body>
              </FeatureCard>
            </Col>
          </Row>
        </Section>
      </Container>
    </PageBackground>
  );
}

export default LandingPage;
