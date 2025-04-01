import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Keyframes animations
const twinkle = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 0.9; }
  100% { opacity: 0.7; }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Styled components
const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e2430 0%, #0b0b19 100%);
  position: relative;
  overflow: hidden;
  color: white;
  font-family: 'Arial', sans-serif;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  text-align: center;
  padding: 0 20px;
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 130px 80px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: ${twinkle} 5s linear infinite;
`;

const Planet = styled.div`
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at 30% 30%, #7B78B4, #372D87);
  border-radius: 50%;
  top: 70%;
  left: 20%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 40px rgba(99, 85, 255, 0.5);
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.8)'};
  transition: all 1s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const Astronaut = styled.div`
  width: 120px;
  height: 120px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="35" r="20" fill="white"/><circle cx="50" cy="80" r="35" fill="white"/><rect x="25" y="75" width="50" height="10" fill="white"/><circle cx="43" cy="32" r="3" fill="black"/><circle cx="57" cy="32" r="3" fill="black"/><path d="M 45 42 C 50 48, 55 48, 60 42" stroke="black" fill="none" stroke-width="2"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  margin: 20px 0;
  animation: ${float} 6s ease-in-out infinite;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #6e8efb, #a777e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-30px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const Message = styled.h2`
  font-size: 2.5rem;
  margin: 10px 0;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(-20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const SubMessage = styled.p`
  max-width: 600px;
  margin: 15px 0 30px;
  line-height: 1.6;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const HomeButton = styled(Link)`
  padding: 12px 24px;
  background: linear-gradient(45deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(110, 142, 251, 0.4);
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(110, 142, 251, 0.6);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const PageNotFound = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    // Trigger animation sequence after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  return (
    <Container>
      <Stars />
      <Planet visible={isVisible} />
      
      <ContentWrapper>
        <ErrorCode visible={isVisible}>404</ErrorCode>
        <Astronaut visible={isVisible} />
        <Message visible={isVisible}>Page Not Found</Message>
        <SubMessage visible={isVisible}>
          Looks like you've ventured into the unknown. The page you're looking for doesn't exist or has been moved to another dimension.
        </SubMessage>
        <HomeButton to="/" visible={isVisible}>
          Return to Home
        </HomeButton>
      </ContentWrapper>
    </Container>
  );
};

export default PageNotFound;