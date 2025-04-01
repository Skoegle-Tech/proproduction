import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button, Container, Card, Paper, TextField, FormControl } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Keyframes animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

// Styled Components
export const StyledContainer = styled(Container)`
  padding-top: ${props => props.theme.spacing(4)};
  padding-bottom: ${props => props.theme.spacing(4)};
  position: relative;
  
  @media (min-width: 600px) {
    padding-top: ${props => props.theme.spacing(8)};
    padding-bottom: ${props => props.theme.spacing(8)};
  }
`;

export const AnimatedFormPaper = styled(Paper)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px ${props => alpha(props.theme.palette.primary.dark, 0.15)};
  transition: box-shadow 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    box-shadow: 0 15px 50px ${props => alpha(props.theme.palette.primary.dark, 0.2)};
  }
`;

export const LeftPanel = styled(Box)`
  background: linear-gradient(135deg, #0f2050 0%, #051630 100%);
  padding: ${props => props.theme.spacing(4)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 20% 30%, rgba(41, 98, 255, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(41, 98, 255, 0.15) 0%, transparent 50%);
    z-index: 0;
  }
`;

export const GradientText = styled(Box)`
  background: linear-gradient(45deg, #4a8cff, #2962ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
  text-shadow: 0px 2px 5px rgba(41, 98, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
`;

export const AnimatedFormControl = styled(FormControl)`
  margin-bottom: ${props => props.theme.spacing(2)};
  transition: transform 0.3s ease, opacity 0.3s ease;
  animation: ${slideInRight} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

export const StepIndicator = styled(Box)`
  display: flex;
  margin-bottom: ${props => props.theme.spacing(4)};
  justify-content: center;
`;

export const StepDot = styled(Box)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => 
    props.active 
      ? props.theme.palette.primary.main 
      : alpha(props.theme.palette.primary.main, 0.3)
  };
  margin: 0 5px;
  transition: all 0.3s ease;
  
  ${props => props.active && `
    transform: scale(1.2);
    box-shadow: 0 0 10px ${alpha(props.theme.palette.primary.main, 0.5)};
  `}
`;

export const StepConnector = styled(Box)`
  height: 2px;
  width: 30px;
  background-color: ${props => 
    props.active 
      ? props.theme.palette.primary.main 
      : alpha(props.theme.palette.primary.main, 0.3)
  };
  margin: auto 0;
`;

export const AnimatedButton = styled(Button)`
  margin-top: ${props => props.theme.spacing(3)};
  padding: 12px;
  border-radius: 30px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #2962ff, #4a8cff);
  box-shadow: 0 4px 15px ${props => alpha(props.theme.palette.primary.main, 0.3)};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      ${props => alpha('#ffffff', 0.2)}, 
      transparent
    );
    transition: left 0.7s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px ${props => alpha(props.theme.palette.primary.main, 0.4)};
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &.Mui-disabled {
    background: linear-gradient(45deg, ${props => alpha('#2962ff', 0.5)}, ${props => alpha('#4a8cff', 0.5)});
  }
`;

export const CardWithAnimation = styled(Card)`
  padding: ${props => props.theme.spacing(2)};
  background-color: ${props => alpha(props.theme.palette.primary.light, 0.1)};
  border: 1px solid ${props => alpha(props.theme.palette.primary.main, 0.2)};
  border-radius: 10px;
  margin-bottom: ${props => props.theme.spacing(3)};
  transition: all 0.3s ease;
  animation: ${pulse} 3s infinite ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px ${props => alpha(props.theme.palette.primary.dark, 0.1)};
  }
`;

export const FloatingElement = styled(Box)`
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

export const CircleDecoration = styled(Box)`
  position: absolute;
  width: ${props => props.size || '200px'};
  height: ${props => props.size || '200px'};
  border-radius: 50%;
  border: 1px solid ${props => alpha(props.theme.palette.primary.main, 0.1)};
  top: ${props => props.top || '10%'};
  left: ${props => props.left || '10%'};
  z-index: 0;
`;

export const ShimmerEffect = styled(Box)`
  background: linear-gradient(
    90deg,
    ${props => alpha(props.theme.palette.background.paper, 0)},
    ${props => alpha(props.theme.palette.background.paper, 0.15)},
    ${props => alpha(props.theme.palette.background.paper, 0)}
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;