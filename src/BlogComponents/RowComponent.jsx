import { Col, Row } from "react-bootstrap";
import BlogComponent from "./BlogComponent";

function RowComponent({ RowObject }) {
  const { col } = RowObject;

  return (
    <Row className="align-items-center">
      {" "}
      {/* Adds vertical centering */}
      {col.map((colObj, i) => (
        <Col
          key={i}
          className="d-flex align-items-center justify-content-center" // Centers content both vertically and horizontally
        >
          <BlogComponent pageComponent={colObj} />
        </Col>
      ))}
    </Row>
  );
}

export default RowComponent;
