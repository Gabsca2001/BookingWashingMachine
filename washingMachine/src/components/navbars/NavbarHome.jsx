import React, { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/styles/navbar.css";
import { LanguageContext } from "../../context/index.jsx";

const NavbarHome = () => {
    const { language, setLanguage } = useContext(LanguageContext); // Destructure language and setLanguage from LanguageContext

    // Handle language change
    const handleLanguage = (lang) => {
        setLanguage(lang); // Update the language in context
    };

    return (
        <Navbar expand="md" className="navbar-custom">
            {/* Navbar with logo on left and links on right */}
            <Container>
                <Navbar.Brand>
                    <Link to="/" className="navbar-logo">
                        <img src="/assets/images/logowm.png" alt="logo" />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="navbar-link">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about" className="navbar-link">
                            {language === "it" ? "Come funziona?" : "How it works?"}
                        </Nav.Link>
                        <NavDropdown
                            title={language === "it" ? "Lingua" : "Language"}
                            id="basic-nav-dropdown"
                            className="navbar-link"
                        >
                            <NavDropdown.Item onClick={() => handleLanguage("it")}>
                                <img src="/assets/images/icons8-italia-32.png" className="mx-2" alt="it" />
                                Italian
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguage("en")}>
                                <img src="/assets/images/icons8-gran-bretagna-32.png" className="mx-2" alt="it" />
                                English
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarHome;
