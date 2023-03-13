import React, { useRef, useState } from "react";
import { Container, Form, Button, Card, Alert, } from 'react-bootstrap';
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";


export default function FormDonation() {
        const navigate = useNavigate()
        const [message, setMessage] = useState(null);
        const [preview, setPreview] = useState(null)
        const [donation, setDonation] = useState({
            title: "",
            goal: "",
            description: "",
            image: "",
        })

        const handleOnChange = (e) => {
            setDonation({
                ...donation,
                [e.target.name] : e.target.type === "file" ? e.target.files : e.target.value
            })
            if (e.target.type === "file") {
                let url = URL.createObjectURL(e.target.files[0])
                setPreview(url)
            }
        }
        const handleSubmit = useMutation(async (e) => {
            try {
                e.preventDefault();
                
                const formData = new FormData();
                formData.append("image", donation.image[0])
                formData.append("title", donation.title)
                formData.append("goal", donation.goal)
                formData.append("description", donation.description)

                const response = await API.post("/donation", formData)
                console.log("success post donation", response)
                setDonation({
                    title: "",
                    goal: "",
                    description: "",
                    image: "",
                })
                
                const alert = (
                <Alert variant="success" className="py-1">
                    Your Donation has been Posted!
                </Alert>
                );
                setMessage(alert)
                navigate("/")
            } catch (error) {
                const alert = (
                <Alert variant="danger" className="py-1">
                    Your have failed to post fundraise!
                </Alert>
                );
                setMessage(alert)
                console.log(error)
            }
        }) 


        const inputRef = useRef()

        const handleUpload = () => {
            inputRef.current?.click();
        }
return (
    <Container className="w-75 fw-bold rounded-2 shadow mt-5 mb-5">


        <Form className="mx-5 mt-1" onSubmit={(e) => handleSubmit.mutate(e)}>
            {message && message}
            <Form.Label 
                className="text-start fw-bold fs-3 my-3"
            >
                Make Raise Fund
            </Form.Label>

            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control 
                    onChange={handleOnChange}
                    name="title" 
                    type="text" 
                    placeholder="Title"
                    value={donation?.title} 
                    style={{ 
                        borderWidth: "2px", 
                        borderColor: "grey", 
                        backgroundColor: "#E5E5E5" }} 
                    autoFocus 
                />
            </Form.Group>
            <Form.Group>

            {preview && (
                <Card.Img
                    variant="bottom"
                    src={preview}
                    alt={preview}
                    style={{ width: "200px", height: "120px", marginTop: "10px" }}
                />
            )}

            <Form.Control 
                onChange={handleOnChange}
                className="my-3 border-grey"
                id="upload"
                style={{borderWidth: "2px", borderColor: "grey", }}
                type="file"
                ref={inputRef}
                placeholder="Attachment Files"
                name="image"
                hidden
                required

                />
            <Button 
                className="d-block my-3 rounded-3"
                variant="danger"
                onClick={handleUpload}
                style={{ backgroundColor: "#C32424"}} >
                Attach Thumbnail
            </Button>



            </Form.Group>
            <Form.Group 
                controlId="goal" 
                >
                <Form.Label>Goals</Form.Label>
                <Form.Control 
                    onChange={handleOnChange}
                    name="goal" 
                    type="text" 
                    placeholder="Goals Donation" 
                    value={donation?.goal}
                    style={{ 
                        borderWidth: "2px", 
                        borderColor: "grey", 
                        backgroundColor: "#E5E5E5" }} 
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    onChange={handleOnChange}
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    value={donation?.description}
                    style={{ 
                        height: '100px', 
                        backgroundColor: "#e1e1e1", 
                        borderWidth: "2px", 
                        borderColor: "grey", 
                    }}
                />
            </Form.Group>
            <div className='d-flex justify-content-end mt-5'>
                <Button style={{ backgroundColor: "#C32424", marginBottom: "20px" }}
                    variant="danger"
                    className="w-50"
                    size="md"
                    type="submit"
                >
                    Publish Fundraising
                </Button>
            </div>
        </Form>

    </Container >

)
}

