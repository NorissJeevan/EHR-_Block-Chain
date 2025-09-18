import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import "./Login.css";

const Login = () => {
    const [type, setType] = useState("patient");
    const [doctors, setDoc] = useState([]);
    const [patients, setPatient] = useState([]);
    const [cookies, setCookie] = useCookies([]);

    const [log, setLog] = useState({
        mail: "",
        password: ""
    });

    // Initialize Web3 and contract (will be guarded with availability checks)
    let web3 = null;
    let mycontract = null;
    
    try {
        // Try to initialize Web3 if blockchain is available
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8000'));
        mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
    } catch (error) {
        console.log('Blockchain not available, running in demo mode');
    }

    function handle(e) {
        const newData = { ...log };
        newData[e.target.name] = e.target.value;
        setLog(newData);
    }

    async function loadDoctors() {
        // Guard blockchain calls - only run if blockchain is available
        if (!web3 || !mycontract) {
            console.log('Blockchain not available, skipping doctor load');
            return;
        }
        
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                console.log('No accounts available');
                return;
            }

            const doctorHashes = await mycontract.methods.getDoctor().call();
            const newDoctors = [];
            
            for (const hash of doctorHashes) {
                try {
                    // In a full implementation, this would fetch from IPFS
                    const data = JSON.parse(hash);
                    if (data['type'] === 'doctor') {
                        newDoctors.push(data);
                    }
                } catch (e) {
                    console.log('Error parsing doctor data:', e);
                }
            }
            
            setDoc(newDoctors);
            setCookie('doctors', newDoctors);
        } catch (error) {
            console.log('Error loading doctors:', error);
        }
    }

    function resetCook(val, data) {
        var list = [];
        for (let j = 1; j < data.length; j++) {
            list.push(data[j]);
        }
        setCookie(val, list);
    }

    async function login(e) {
        try {
            // Temporary login with demo credentials (bypassing IPFS for now)
            // Demo credentials - replace with real IPFS integration later
            const demoCredentials = {
                patients: [
                    { mail: "patient@demo.com", password: "patient123", hash: "patient_demo_hash" },
                    { mail: "john.doe@email.com", password: "password", hash: "patient_john_hash" }
                ],
                doctors: [
                    { mail: "doctor@demo.com", password: "doctor123", hash: "doctor_demo_hash" },
                    { mail: "dr.smith@hospital.com", password: "password", hash: "doctor_smith_hash" }
                ]
            };

            if (!e) {
                // Patient login
                const patient = demoCredentials.patients.find(p => p.mail === log.mail);
                if (patient) {
                    if (patient.password === log.password) {
                        setCookie('hash', patient.hash);
                        setCookie('type', 'patient');
                        setCookie('userEmail', patient.mail);
                        alert("Patient logged in successfully!");
                        window.location.href = "/myprofile";
                        return;
                    } else {
                        alert("Wrong Password");
                        return;
                    }
                } else {
                    alert("Patient not found. Try: patient@demo.com / patient123");
                    return;
                }
            } else {
                // Doctor login  
                const doctor = demoCredentials.doctors.find(d => d.mail === log.mail);
                if (doctor) {
                    if (doctor.password === log.password) {
                        setCookie('hash', doctor.hash);
                        setCookie('type', 'doctor');
                        setCookie('userEmail', doctor.mail);
                        alert("Doctor logged in successfully!");
                        window.location.href = "/myprofiledoc";
                        return;
                    } else {
                        alert("Wrong Password");
                        return;
                    }
                } else {
                    alert("Doctor not found. Try: doctor@demo.com / doctor123");
                    return;
                }
            }
        } catch (error) {
            console.log("Login error:", error);
            alert("Login failed. Please try again.");
        }
    }

    async function show() {
        // Guard blockchain calls - only run if blockchain is available
        if (!web3 || !mycontract) {
            console.log('Blockchain not available, cannot show data');
            return;
        }
        
        try {
            // Using getDoctor instead of getdata (which doesn't exist in ABI)
            const doctorData = await mycontract.methods.getDoctor().call();
            const patientData = await mycontract.methods.getPatient().call();
            
            console.log('Doctors:', doctorData);
            console.log('Patients:', patientData);
        } catch (error) {
            console.log('Error showing data:', error);
        }
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
                            <select id="user-type" name="type" value={type} onChange={(e) => { setType(e.target.value) }} style={{ padding: '0.5rem', backgroundColor: 'white' }}>
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
                    onClick={() => { login(type === "doctor") }}
                />
                <p style={{ textAlign: "right" }}>Don't have an account?
                    <Link style={{ marginLeft: "4px", color: "black", textDecoration: "underline" }} to='/signup'>Sign Up.</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
