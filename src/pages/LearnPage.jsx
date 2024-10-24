import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { H2, P } from "../Components/Typography";
import { FaArrowRight, FaSearch, FaArrowLeft } from "react-icons/fa";
import axios from "axios"; // Import axios for API requests
import axiosInstance from "../utils/axiosInstance";
import { getUrl } from "../services/UrlServices";

// Styled Components
const PageWrapper = styled.div`
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  min-height: 100vh;
  padding: 60px 0;
`;

const BackButton = styled(Button)`
  background-color: #6c757d;
  border: none;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #5a6268;
  }

  svg {
    margin-right: 5px;
  }
`;

const SearchInputGroup = styled(InputGroup)`
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
`;

const SubjectCard = styled(Card)`
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
  }

  .card-img-top {
    height: 200px;
    object-fit: cover;
  }
`;

const SubjectTitle = styled(Card.Title)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #007bff;
`;

const CardBody = styled(Card.Body)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DescriptionText = styled(P)`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const StartButton = styled(Button)`
  background-color: #007bff;
  border: none;
  margin-top: 15px;
  align-self: flex-end;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-left: 5px;
  }
`;

const NoResultsMessage = styled(Alert)`
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
`;

function LearnPage() {
  const [subjects, setSubjects] = useState([]); // State for subjects
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get("/blogSubjects"); // Adjust this URL as per your routing
        setSubjects(response.data); // Set the fetched subjects
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []); // Empty dependency array to run only once

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter((subject) =>
    subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle navigation to subject details page
  const handleStartLearning = (subjectId) => {
    navigate(`/Blog/${subjectId}`);
  };

  return (
    <PageWrapper>
      <Container>
        <BackButton onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Landing Page
        </BackButton>

        <Row className="align-items-center mb-4">
          <Col xs={12} md={6}>
            <H2>Explore Our Learning Modules</H2>
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-md-end">
            <SearchInputGroup>
              <Form.Control
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search subjects"
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </SearchInputGroup>
          </Col>
        </Row>

        <P>
          Choose from a variety of subjects designed to enhance your skills and
          knowledge. From foundational concepts to advanced topics, start your
          learning journey today!
        </P>

        {filteredSubjects.length === 0 ? (
          <NoResultsMessage variant="warning">
            No subjects found. Try searching with a different term.
          </NoResultsMessage>
        ) : (
          <Row>
            {filteredSubjects.map((subject) => (
              <Col md={4} key={subject.subjectId} className="d-flex mb-4">
                <SubjectCard>
                  <Card.Img
                    variant="top"
                    src={
                      getUrl(subject.subjectImage) ||
                      "https://placehold.co/300x200"
                    }
                    alt={subject.subjectName}
                  />
                  <CardBody>
                    <div>
                      <SubjectTitle>{subject.subjectName}</SubjectTitle>
                      <DescriptionText>
                        {subject.subjectDescription}
                      </DescriptionText>
                    </div>
                    <StartButton
                      onClick={() => handleStartLearning(subject.subjectId)}
                    >
                      Start Learning <FaArrowRight />
                    </StartButton>
                  </CardBody>
                </SubjectCard>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PageWrapper>
  );
}

export default LearnPage;
