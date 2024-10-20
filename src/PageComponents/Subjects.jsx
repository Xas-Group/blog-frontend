import { useState } from "react";
import {
  Col,
  ListGroup,
  Button,
  Form,
  InputGroup,
  Image,
} from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";

function Subjects({
  subjects,
  setSubjects,
  selectedSubject,
  setSelectedSubject,
  handleShowModal,
  searchTerm,
  setSearchTerm,
}) {
  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Col className="p-3">
      <h4>Manage Subject</h4>
      <hr />
      <Button
        variant="primary"
        className="mb-3 d-flex align-items-center"
        onClick={() => handleShowModal("subject")}
      >
        <FaPlus className="me-2" /> Add Subject
      </Button>

      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search Subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
      </InputGroup>

      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <ListGroup>
          {filteredSubjects.map((subject) => (
            <ListGroup.Item
              key={subject.id}
              className={`d-flex align-items-start ${
                selectedSubject && selectedSubject.id === subject.id
                  ? "bg-primary text-white"
                  : ""
              }`}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => handleShowModal("subject", subject)}
              onClick={() => setSelectedSubject(subject)}
            >
              <Image src={subject.image} rounded className="me-3" />
              <div>
                <strong>{subject.title}</strong>
                <p className="mb-0">{subject.description}</p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Col>
  );
}

export default Subjects;
