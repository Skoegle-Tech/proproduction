import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

// Styled components
const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a2a3a 0%, #0e1420 100%);
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
  max-width: 800px;
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(41, 121, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(41, 121, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
`;

const Gear = styled.div`
  position: absolute;
  width: ${props => props.size || '120px'};
  height: ${props => props.size || '120px'};
  border-radius: 50%;
  background: ${props => props.color || '#2979ff'};
  box-shadow: 0 0 20px rgba(41, 121, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  top: ${props => props.top || '40%'};
  left: ${props => props.left || '25%'};
  opacity: ${props => props.visible ? 0.8 : 0};
  transform: ${props => props.visible ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  animation: ${spin} ${props => props.duration || '20s'} linear infinite ${props => props.direction || 'normal'};
  
  &:before {
    content: '';
    position: absolute;
    width: 40%;
    height: 40%;
    background: #0e1420;
    border-radius: 50%;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 85%;
    height: 85%;
    border-radius: 50%;
    border: 15px dashed ${props => props.color || '#2979ff'};
    box-sizing: border-box;
  }
`;

const Server = styled.div`
  width: 180px;
  height: 220px;
  background: linear-gradient(to bottom, #3a4655, #252d3a);
  border-radius: 10px;
  position: relative;
  margin: 30px 0;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  animation: ${float} 6s ease-in-out infinite;
  
  &:before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    height: 25px;
    background: #1e2730;
    border-radius: 5px;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 15px;
    left: 15px;
    right: 15px;
    height: 120px;
    background: #1e2730;
    border-radius: 5px;
  }
`;

const ServerLight = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${props => props.color || '#ff5252'};
  border-radius: 50%;
  top: 24px;
  right: ${props => props.position || '30px'};
  z-index: 2;
  box-shadow: 0 0 10px ${props => props.color || '#ff5252'};
  animation: ${blink} ${props => props.speed || '2s'} infinite;
`;

const MaintenanceText = styled.h1`
  font-size: 2.8rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #3498db, #2979ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-30px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const Message = styled.h2`
  font-size: 1.8rem;
  margin: 15px 0;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(-20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const SubMessage = styled.p`
  max-width: 600px;
  margin: 15px 0 30px;
  line-height: 1.6;
  font-size: 1.1rem;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const ETA = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
  border-radius: 8px;
  margin-top: 20px;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const TimeLabel = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const DateTime = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 1s cubic-bezier(0.215, 0.61, 0.355, 1);
  animation: ${pulse} 3s infinite;
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff9800;
  animation: ${blink} 1.5s infinite;
`;

const ServerMaintenance = () => {
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    // Trigger animation sequence after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    
    
    // Calculate estimated completion time (3 hours from current time)
    const completionDate = new Date('2025-03-26T15:41:25');
    completionDate.setHours(completionDate.getHours() + 3);
  }, []);

  return (
    <Container>
      <Grid />
      <Gear size="180px" top="30%" left="15%" color="#3498db" visible={isVisible} duration="25s" />
      <Gear size="120px" top="25%" left="25%" color="#2979ff" visible={isVisible} duration="15s" direction="reverse" />
      <Gear size="150px" top="65%" left="75%" color="#3498db" visible={isVisible} duration="20s" />
      
      <ContentWrapper>
        <MaintenanceText visible={isVisible}>Server Under Maintenance</MaintenanceText>
        
        <Server visible={isVisible}>
          <ServerLight color="#ff5252" position="30px" speed="1.5s" />
          <ServerLight color="#ffb142" position="50px" speed="2.5s" />
          <ServerLight color="#2ed573" position="70px" speed="3.5s" />
        </Server>
        
        <Message visible={isVisible}>We're upgrading our systems</Message>
        
        <SubMessage visible={isVisible}>
          Our team is performing scheduled maintenance to improve your experience.
          The server will be back online shortly. We appreciate your patience.
        </SubMessage>
        
        <StatusRow visible={isVisible}>
          <StatusDot />
          <span>Maintenance in progress</span>
        </StatusRow>
        
        {/* <ETA visible={isVisible}>
          <div>
            <TimeLabel>Current Time (UTC):</TimeLabel>
            <DateTime>{currentTime}</DateTime>
          </div>
          <div>
            <TimeLabel>Estimated Completion:</TimeLabel>
            <DateTime>{estimatedCompletion}</DateTime>
          </div>
        </ETA> */}
      </ContentWrapper>
    </Container>
  );
};

export default ServerMaintenance;