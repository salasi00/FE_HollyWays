import moment from "moment";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Stack } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import rupiahFormat from "rupiah-format";
import { API } from "../config/api";

export default function DetailDonation() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [show, setShow] = useState()
    const [form, setForm] = useState({
        total: "",
        donation_id: "",
    })

    let {data: donation} = useQuery(`detailCache`, async () => {
        
           
        
        const response = await API.get("/donation/" + id)
        console.log("detail", response)
        return response.data.data
    });

    let {data: transactions, refetch: transactionRefetch} = useQuery("transactionCache", async() => {
        const response = await API.get(`/transaction-donation?donation_id=${id}`)
        console.log("transactionId", response.data.data)
        return response.data.data
    })


    let max = donation?.goal
    let now = donation?.current_goal
    let percent = Math.round(now / max * 100) 
     console.log("percent", percent)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : [e.target.value],
        })
    } 

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        };
      }, []);
    
    
      const handleTransaction = useMutation(async (e) => {
        try {
          e.preventDefault();
          const config = {
          headers: {
            Authorization: "Basic " + localStorage.token,
          'Content-type': 'application/json',
        },
      };
          const data = {
            donation_id: donation.id,
            total: parseInt(form.total)
          };
    
          const body = JSON.stringify(data);
    
          const response = await API.post('/transaction', body, config);
          console.log("transaction success :", response)
    
          const token = response.data.data.token;
          window.snap.pay(token, {
            onSuccess: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              navigate("/profile");
            },
            onPending: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              navigate("/profile");
            },
            onError: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              navigate("/profile");
            },
            onClose: function () {
              /* You may add your own implementation here */
              alert("you closed the popup without finishing the payment");
            },
          });
        } catch (error) {
          console.log("transaction failed : ", error);
        }
      });
    return (
        <>
            <Container className="my-4">
                <Row className="d-flex justify-content-center">
                    <Col >
                        <img src={donation?.image} width="100%" className="rounded-2 mx-4 " alt="img" style={{ maxHeight: "22rem" }} />
                    </Col>
                    <Col >
                        <Col xs="4" className="mb-5 w-75 mx-5">

                            <Col className="mb-1 py-0 fs-5">
                                {donation?.title}

                            </Col>

                            <Stack direction="horizontal" className="py-2">


                                <Col className="text-danger fw-bold text-start">
                                    {/* Rp. 0 */}
                                    { rupiahFormat.convert(donation?.current_goal)} 
                                </Col>

                                <Col className="">Gathered from </Col>
                                <Col className="text-secondary fw-bold text-end">
                                    {rupiahFormat.convert(donation?.goal)}
                                </Col>
                            </Stack>

                            <ProgressBar 
                                variant="danger" 
                                max={donation?.goal} 
                                now={donation?.current_goal} 
                                label={`${percent}%`} 
                            />

                            <Stack direction="horizontal">
                                <Col className="text-dark fw-bold text-start mt-2">
                                    {donation?.total_donation} donation
                                </Col>
                                <Col className="text-dark fw-bold text-end mt-2">

                                    {moment(donation?.created_at).format("DD MMMM YYYY")}
                                </Col>
                            </Stack>
                            <Col className="my-2" style={{ height: "9rem" }}>
                                {donation?.description}
                            </Col>


                            <Col className="text-secondary mt-1">
                                {percent !== 100 ? (
                                    <Button variant="danger" className="text-light fw-bold w-100" onClick={() => setShow(true)}>Donate</Button>
                                ) : (
                                    <Button variant="danger" className="text-light fw-bold w-100" disabled>Donation Closed</Button>
                                )}
                            </Col>


                        </Col >
                    </Col>
                </Row>
                <Card.Text className="fs-4 fw-bold mx-3">
                    List Donation {"("} {donation?.total_donation} {")"}
                </Card.Text>

                <Row className="d-flex justify-content-start w-100 mx-3 overflow-auto mb-5 scrollView" style={{ height: "22vh" }}>
                    {transactions?.map((items, index) => (

                        <Col md={3} key={index} className="bg-white mt-3 rounded-2 mx-2" style={{ boxShadow: "0px 0px 5px black", backgroundColor: "white", width: "16rem" }}>
                            <Card.Text className="fw-bold fs-5 py-0">
                                {items?.user?.fullname}
                            </Card.Text>
                            <Card.Text className="fw-bold py-0">
                                {items?.created_at}
                            </Card.Text>

                            <Row>
                                <Col sm={6} className="mx-2 text-start">{rupiahFormat.convert(items?.total)}</Col>
                                <Col sm={2} className="text-end mx-1 mb-2">
                                    {items?.status === "success" ?
                                        <Badge className="bg-success"> Finished</Badge> :
                                        items?.status !== "success" ?
                                            <Badge className="bg-danger">{items?.status}</Badge> :
                                            null
                                    }</Col>
                            </Row>
                        </Col>

                    ))}

                </Row>

            </Container>

            <Modal show={show} onHide={setShow}
                size="sm p-1"
                aria-labelledby="contained-modal-title-center"
                centered
            >

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="total">
                            <Form.Label className="mb-3 fw-bold fs-5">Nominal Donation </Form.Label>
                            <Form.Control
                                type="number"
                                name="total"
                                placeholder="nominal donation"
                                autoFocus
                                onChange={handleChange}
                                value={form?.total}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="w-100" onClick={(e) => handleTransaction.mutate(e)}>
                        Donation
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


