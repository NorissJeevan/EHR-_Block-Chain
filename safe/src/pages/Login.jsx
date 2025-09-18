import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import "./Login.css";

const Login = () => {
    const [type, setType] = useState(false);
    const [doctors, setDoc] = useState([]);
    const [patients, setPatient] = useState([]);
    const [cookies, setCookie] = useCookies([]);

    const [log, setLog] = useState({
        mail: "",
        password: ""
    });

    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(
        contract["abi"],
        contract["address"]
    );

    function handle(e) {
        const newData = { ...log };
        newData[e.target.name] = e.target.value;
        setLog(newData);
    }

    async function loadDoctors() {
        var accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        var currentaddress = accounts[0];

        const web3 = new Web3(window.ethereum);
        const mycontract = new web3.eth.Contract(
            contract["abi"],
            contract["address"]
        );

        mycontract.methods
            .getdata()
            .call()
            .then(res => {
                res.map(data => {
                    data = JSON.parse(data);
                    if (data['type'] === 'doctor') {
                        doctors.push(data);
                    }
                })
                setCookie('doctors', doctors);
            })
    }

    function resetCook(val, data) {
        var list = [];
        for (let j = 1; j < data.length; j++) {
            list.push(data[j]);
        }
        setCookie(val, list);
    }

    async function login(e) {
        if (!e) {
            // patient
            const patientHashes = await mycontract.methods.getPatient().call();
            for (const hash of patientHashes) {
                try {
                    const res = await fetch(`http://localhost:8080/ipfs/${hash}`);
                    const patientData = await res.json();
                    if (patientData.mail === log.mail) {
                        if (patientData.password === log.password) {
                            setCookie('hash', hash);
                            setCookie('type', 'patient');
                            alert("Logged in");
                            window.location.href = "/myprofile";
                            return; 
                        } else {
                            alert("Wrong Password");
                            return;
                        }
                    }
                } catch (err) {
                    console.log("Error fetching patient data:", err);
                }
            }
        } else {
            // doctor
            const doctorHashes = await mycontract.methods.getDoctor().call();
            for (const hash of doctorHashes) {
                try {
                    const res = await fetch(`http://localhost:8080/ipfs/${hash}`);
                    const doctorData = await res.json();
                    if (doctorData.mail === log.mail) {
                        if (doctorData.password === log.password) {
                            setCookie('hash', hash);
                            setCookie('type', 'doctor');
                            alert("Logged in");
                            window.location.href = "/myprofiledoc";
                            return;
                        } else {
                            alert("Wrong Password");
                            return;
                        }
                    }
                } catch (err) {
                    console.log("Error fetching doctor data:", err);
                }
            }
        }
    }

    async function show() {
        mycontract.methods
            .getdata()
            .call()
            .then(res => {
                res.map(d => {
                    console.log(JSON.parse(d));
                })
            })
    }

    return (
        <div className="login-container bg-gradient-to-r from-cyan-500 to-blue-500 via-teal-200 ">
            <form className="login-form backdrop-blur-lg
               [ p-8 md:p-10 lg:p-10 ]
               [ bg-gradient-to-b from-white/60 to-white/30 ]
               [ border-[1px] border-solid border-white border-opacity-30 ]
               [ shadow-black/70 shadow-2xl ]">
                <h2 className="login-form-title">Log In</h2>
                <div className="input-container">
                    <div className="input-div">
                        <div className="input-heading">
                            <i className="fas fa-user"></i>
                            <h5>Email</h5>
                        </div>
                        <input
                            onChange={(e) => handle(e)}
                            type="email"
                            placeholder="youremail@gmail.com"
                            id="email"
                            name="mail"
                        />
                    </div>
                    <div className="input-div">
                        <div className="input-heading">
                            <i className="fas fa-lock"></i>
                            <h5>Password</h5>
                        </div>
                        <input
                            onChange={(e) => handle(e)}
                            type="password"
                            placeholder="********"
                            id="password"
                            name="password"
                        />
                    </div>
                    <div className="input-div">
                        <div className="input-heading" style={{ margin: "1rem 0", }}>
                            <i className="fas fa-key"></i>
                            <h5>User Type</h5>
                            <select id="user-type" name="type" onChange={() => { setType(!type) }} style={{ padding: '0.5rem', backgroundColor: 'white' }}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                    </div>
                    <p style={{ textAlign: "right" }}>Forgot password?</p>
                </div>

                <input
                    type="button"
                    className="btn"
                    value="Log In"
                    onClick={() => { login(type) }}
                />
                <p style={{ textAlign: "right" }}>Don't have an account?
                    <Link style={{ marginLeft: "4px", color: "black", textDecoration: "underline" }} to='/signup'>Sign Up.</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
