import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";
import { getUrl } from "../services/UrlServices";

const SubjectModal = ({
  showSubjectModal,
  handleCloseSubjectModal,
  isUpdating,
  initialFormData = {},
  selectedSubjectId,
  refreshSubjectsList,
}) => {
  const [subjectFormData, setSubjectFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
    order: "",
    publishStatus: "onhold", // Default to 'onhold'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set form data for edit or reset for add
    if (initialFormData && isUpdating) {
      setSubjectFormData({
        title: initialFormData.subjectName || "",
        description: initialFormData.subjectDescription || "",
        image: null,
        imagePreview: initialFormData.subjectImage
          ? getUrl(initialFormData.subjectImage)
          : null,
        order: initialFormData.subjectOrder || "",
        publishStatus: initialFormData.publishStatus || "onhold",
      });
    } else {
      setSubjectFormData({
        title: "",
        description: "",
        image: null,
        imagePreview: null,
        order: "",
        publishStatus: "onhold",
      });
    }
  }, [initialFormData, isUpdating]);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.includes("image")) {
            const file = item.getAsFile();
            setSubjectFormData((prevData) => ({
              ...prevData,
              image: file,
              imagePreview: URL.createObjectURL(file),
            }));
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubjectFormData((prevData) => ({
        ...prevData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const isFormValid = () => {
    return (
      subjectFormData.title.trim() !== "" &&
      subjectFormData.description.trim() !== "" &&
      subjectFormData.order !== "" &&
      subjectFormData.publishStatus !== ""
    );
  };

  const handleSubjectFormSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("subjectName", subjectFormData.title);
    formData.append("subjectDescription", subjectFormData.description);
    formData.append("subjectOrder", subjectFormData.order);
    formData.append("publishStatus", subjectFormData.publishStatus);
    if (subjectFormData.image) {
      formData.append("image", subjectFormData.image);
    }

    try {
      if (isUpdating && selectedSubjectId) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to update the subject.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          await axiosInstance.put(`/subject/${selectedSubjectId}`, formData);
          toast.success("Subject updated successfully");
          refreshSubjectsList();
          handleCloseSubjectModal();
        }
      } else {
        await axiosInstance.post("/subject", formData);
        toast.success("Subject added successfully");
        refreshSubjectsList();
        handleCloseSubjectModal();
      }
    } catch (err) {
      console.error("Error in subject operation:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save subject. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubjectId) {
      toast.error("No subject selected for deletion.");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true);

      try {
        await axiosInstance.delete(`/subject/${selectedSubjectId}`);
        toast.success("Subject deleted successfully");
        refreshSubjectsList();
        handleCloseSubjectModal();
      } catch (err) {
        console.error("Error deleting subject:", err);
        toast.error(
          err.response?.data?.message ||
            "Failed to delete subject. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Modal show={showSubjectModal} onHide={handleCloseSubjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? "Update" : "Add"} Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formSubjectTitle">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Subject Name"
                name="title"
                value={subjectFormData.title}
                onChange={handleSubjectFormChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                name="description"
                value={subjectFormData.description}
                onChange={handleSubjectFormChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectImage">
              <Form.Label>Subject Image (Paste or Upload)</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                disabled={loading}
              />
              {subjectFormData.imagePreview && (
                <div className="mt-3">
                  <Image
                    src={subjectFormData.imagePreview}
                    alt="Subject Preview"
                    thumbnail
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
              <Form.Text className="text-muted">
                You can also paste an image using <strong>Ctrl + V</strong>.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectOrder">
              <Form.Label>Subject Order</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter subject order"
                name="order"
                value={subjectFormData.order}
                onChange={handleSubjectFormChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublishStatus">
              <Form.Label>Publish Status</Form.Label>
              <Form.Select
                name="publishStatus"
                value={subjectFormData.publishStatus}
                onChange={handleSubjectFormChange}
                disabled={loading}
                required
              >
                <option value="publish">Publish</option>
                <option value="onhold">On Hold</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button
              variant="danger"
              onClick={handleDeleteSubject}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSubjectFormSubmit}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : isUpdating ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloseSubjectModal}
            disabled={loading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default SubjectModal;
