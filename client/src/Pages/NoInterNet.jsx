import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const wave = keyframes`
  0% { transform: translateY(0px); }
  25% { transform: translateY(-5px); }
  50% { transform: translateY(0px); }
  75% { transform: translateY(5px); }
  100% { transform: translateY(0px); }
`;

const signalFade = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled components
const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #252b3b 0%, #0c1023 100%);
  position: relative;
  overflow: hidden;
  color: white;
  font-family: 'Arial', sans-serif;
`;

const InfoBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  font-size: 0.9rem;
  z-index: 100;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  text-align: center;
  padding: 0 20px;
  max-width: 650px;
`;

const CirclePattern = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  border-radius: 50%;
  border: 1px solid rgba(52, 152, 219, 0.1);
  z-index: 0;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border: 1px solid rgba(52, 152, 219, 0.1);
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border: 1px solid rgba(52, 152, 219, 0.1);
  }
`;

const WiFiIcon = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  animation: ${float} 5s ease-in-out infinite;
`;

const WiFiCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  border: 3px solid ${props => props.color || '#3498db'};
  opacity: ${props => props.opacity || 0.3};
  animation: ${signalFade} ${props => props.duration || '2s'} infinite ${props => props.delay || '0s'};
`;

const DisconnectedIcon = styled.div`
  position: absolute;
  width: 60px;
  height: 10px;
  background: #e74c3c;
  border-radius: 5px;
  transform: rotate(-45deg);
  top: 50%;
  left: 50%;
  margin-top: -5px;
  margin-left: -30px;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.7);
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1s ease-in-out;
`;

const MainText = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-30px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const SubText = styled.h2`
  font-size: 1.5rem;
  margin: 15px 0;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(-20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const Message = styled.p`
  max-width: 500px;
  margin: 15px 0 30px;
  line-height: 1.6;
  font-size: 1.1rem;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const RetryButton = styled.button`
  padding: 12px 28px;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.6);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const RefreshIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${props => props.isRefreshing ? `${rotate} 1s linear infinite` : 'none'};
`;

const TroubleshootingList = styled.ul`
  text-align: left;
  margin-top: 40px;
  width: 100%;
  max-width: 500px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const TroubleshootingItem = styled.li`
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 10px;
  
  &:before {
    content: '•';
    color: #3498db;
    font-size: 1.5rem;
  }
`;

const NoInternetPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime] = useState('2025-03-26 15:48:50');
  const [username] = useState('ManojGowda89');

  useEffect(() => {
    // Trigger animation sequence after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleRetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Here you would normally check for internet connection
      // For demo purposes, we'll just keep showing the no internet page
    }, 2000);
  };

  // Get first letter of username for avatar
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <Container>
      {/* <InfoBar>
        <UserInfo>
          <UserAvatar>{userInitial}</UserAvatar>
          <span>{username}</span>
        </UserInfo>
        <span>{currentTime} UTC</span>
      </InfoBar> */}
      
      <CirclePattern />
      
      <ContentWrapper>
        <WiFiIcon visible={isVisible}>
          <WiFiCircle size={120} color="#3498db" opacity={0.2} duration="3s" />
          <WiFiCircle size={90} color="#3498db" opacity={0.3} duration="3s" delay="0.3s" />
          <WiFiCircle size={60} color="#3498db" opacity={0.4} duration="3s" delay="0.6s" />
          <WiFiCircle size={30} color="#3498db" opacity={0.5} duration="3s" delay="0.9s" />
          <DisconnectedIcon visible={isVisible} />
        </WiFiIcon>
        
        <MainText visible={isVisible}>No Internet Connection</MainText>
        <SubText visible={isVisible}>You're currently offline</SubText>
        
        <Message visible={isVisible}>
          We can't detect an internet connection. Check your network settings and try again.
          Your work will be saved locally until connection is restored.
        </Message>
        
        <RetryButton visible={isVisible} onClick={handleRetry}>
          <RefreshIcon isRefreshing={isRefreshing} />
          <span>{isRefreshing ? 'Checking...' : 'Retry Connection'}</span>
        </RetryButton>
        
        <TroubleshootingList visible={isVisible}>
          <TroubleshootingItem>Check your network cables, modem, and router</TroubleshootingItem>
          <TroubleshootingItem>Reconnect to your Wi-Fi network</TroubleshootingItem>
          <TroubleshootingItem>If using a VPN, verify it's connected properly</TroubleshootingItem>
          <TroubleshootingItem>Contact your network administrator if the problem persists</TroubleshootingItem>
        </TroubleshootingList>
      </ContentWrapper>
    </Container>
  );
};

export default NoInternetPage;