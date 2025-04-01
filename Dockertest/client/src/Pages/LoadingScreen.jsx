import React, { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Container, Paper, 
  LinearProgress, useTheme, alpha, Fade, Zoom, Grow
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  LocationOn as LocationIcon,
  Public as GlobeIcon,
  MyLocation as PinpointIcon,
  Satellite as SatelliteIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
`;

const ping = keyframes`
  0% { transform: scale(0.2); opacity: 1; }
  80%, 100% { transform: scale(1.5); opacity: 0; }
`;

const scan = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${pulse} 3s infinite ease-in-out`,
  marginBottom: theme.spacing(4),
}));

const PingRing = styled(Box)(({ theme, delay = 0 }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: `2px solid ${theme.palette.primary.main}`,
  animation: `${ping} 2s infinite`,
  animationDelay: `${delay}s`,
}));

const SatelliteOrbit = styled(Box)(({ theme, duration = '20s', reverse = false }) => ({
  position: 'absolute',
  animation: `${orbit} ${duration} infinite linear ${reverse ? 'reverse' : 'normal'}`,
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: alpha('#4a8cff', 0.2),
  color: '#4a8cff',
  margin: theme.spacing(1),
}));

const MapBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `radial-gradient(circle at center, ${alpha('#4a8cff', 0.05)} 0%, transparent 70%)`,
  backgroundSize: '400% 400%',
  animation: `${scan} 15s ease infinite`,
  opacity: 0.6,
  zIndex: 0,
}));

const GridLine = styled(Box)(({ theme, vertical = false }) => ({
  position: 'absolute',
  ...(vertical 
    ? { top: 0, bottom: 0, width: '1px', left: `${Math.random() * 100}%` }
    : { left: 0, right: 0, height: '1px', top: `${Math.random() * 100}%` }
  ),
  background: alpha('#4a8cff', 0.1),
  zIndex: 0,
}));

const FloatingElement = styled(Box)(({ theme, duration = '6s', delay = '0s' }) => ({
  animation: `${float} ${duration} ease-in-out infinite`,
  animationDelay: delay,
}));

const LoadingScreen = () => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Initializing...');
  const [showContent, setShowContent] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  
  // Create grid lines for map effect
  const gridLines = Array.from({ length: 10 }, (_, i) => i);

  // Feature icons to display
  const features = [
    { icon: <LocationIcon />, label: 'Real-time Tracking' },
    { icon: <SpeedIcon />, label: 'Speed Monitoring' },
    { icon: <GlobeIcon />, label: 'Global Coverage' },
    { icon: <SecurityIcon />, label: 'Secure Connection' },
  ];

  useEffect(() => {
    // Show content with slight delay for better animation sequence
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 600);

    // Show features after progress reaches 50%
    const featuresTimer = setTimeout(() => {
      setShowFeatures(true);
    }, 3000);

    // Progress animation
    const progressSteps = [
      { value: 15, text: 'Loading resources...' },
      { value: 35, text: 'Connecting to Servers...' },
      { value: 50, text: 'Initializing Api Connection' },
      { value: 65, text: 'Syncing...' },
      { value: 80, text: 'Preparing tracking interface...' },
      { value: 95, text: 'Almost ready...' },
      { value: 100, text: 'Welcome to Vmarg!' }
    ];

    let currentStep = 0;
    
    const progressTimer = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep].value);
        setProgressText(progressSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(progressTimer);
      }
    }, 800);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(featuresTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        background: `linear-gradient(135deg, #0f2050 0%, #051630 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Map grid background */}
      <MapBackground />
      
      {/* Grid lines for map effect */}
      {gridLines.map((line) => (
        <React.Fragment key={`h-${line}`}>
          <GridLine />
          <GridLine vertical />
        </React.Fragment>
      ))}
      
      {/* Info bar with user data */}
      <Fade in={showContent} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: 'transparent',
            color: 'white',
            borderBottom: '1px solid',
            borderColor: alpha('#ffffff', 0.1),
            backdropFilter: 'blur(5px)',
          }}
        >
        
        </Paper>
      </Fade>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Zoom in={showContent} timeout={1000}>
          <Box>
            {/* Logo animation */}
            <LogoContainer>
              <PingRing delay={0} sx={{ borderColor: '#4a8cff' }} />
              <PingRing delay={0.5} sx={{ borderColor: '#4a8cff' }} />
              <PingRing delay={1} sx={{ borderColor: '#4a8cff' }} />
              
              <Box
                sx={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha('#ffffff', 0.1),
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 30px ${alpha('#4a8cff', 0.5)}`,
                }}
              >
                <LocationIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: '#4a8cff',
                    filter: `drop-shadow(0 0 10px ${alpha('#4a8cff', 0.8)})`,
                  }} 
                />
              </Box>
              
              {/* Orbiting satellite */}
              <SatelliteOrbit duration="15s">
                <SatelliteIcon sx={{ color: alpha('#ffffff', 0.7), fontSize: 20 }} />
              </SatelliteOrbit>
              
              <SatelliteOrbit duration="20s" reverse>
                <PinpointIcon sx={{ color: alpha('#ffffff', 0.7), fontSize: 20 }} />
              </SatelliteOrbit>
            </LogoContainer>

            {/* Product name */}
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: '#ffffff',
                mb: 1,
                textShadow: `0 2px 10px ${alpha('#000000', 0.3)}`,
                letterSpacing: 1,
              }}
            >
              V-MARG
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: alpha('#ffffff', 0.8),
                mb: 4,
                fontWeight: 300,
                letterSpacing: 1,
              }}
            >
              GPS TRACKING SOLUTION
            </Typography>
            
            {/* Progress information */}
            <Box sx={{ position: 'relative', mb: 2, width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#ffffff', 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(90deg, #2962ff, #4a8cff)',
                    borderRadius: 4,
                  }
                }}
              />
              
              <Typography
                variant="body2"
                color="white"
                sx={{ 
                  mt: 1,
                  fontWeight: 500,
                  textAlign: 'center',
                  minHeight: '24px', // Keep consistent height during text changes
                }}
              >
                {progressText}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 0.5,
                  px: 1,
                  opacity: 0.7,
                }}
              >
                <Typography variant="caption" color="white">0%</Typography>
                <Typography variant="caption" color="white">100%</Typography>
              </Box>
            </Box>
            
            {/* Feature highlights that appear during loading */}
            <Fade in={showFeatures} timeout={1500}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  mt: 3,
                  mb: 2,
                }}
              >
                {features.map((feature, index) => (
                  <Grow
                    key={index}
                    in={showFeatures}
                    timeout={(index + 1) * 300}
                    style={{ transformOrigin: 'center' }}
                  >
                    <FloatingElement 
                      duration={`${6 + index}s`} 
                      delay={`${index * 0.5}s`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        m: 2,
                        width: 100,
                      }}
                    >
                      <IconBox>
                        {feature.icon}
                      </IconBox>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: alpha('#ffffff', 0.85),
                          mt: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {feature.label}
                      </Typography>
                    </FloatingElement>
                  </Grow>
                ))}
              </Box>
            </Fade>
            
            {/* Loading tip that changes */}
            <Fade in={progress > 40} timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 3,
                  borderRadius: 2,
                  backgroundColor: alpha('#1a365d', 0.4),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: alpha('#4a8cff', 0.1),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#ffffff', 0.8),
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                  }}
                >
                  {progress < 50 ? 
                    "Tip: V-Marg provides real-time location tracking for your entire fleet" : 
                    progress < 80 ? 
                    "Tip: You can set up custom alerts for specific geographic zones" :
                    "Tip: Access your tracking data securely from any device"}
                </Typography>
              </Paper>
            </Fade>
          </Box>
        </Zoom>
      </Container>
      
      {/* Optional powered by footer */}
      <Fade in={showContent} timeout={1500}>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 16,
            opacity: 0.5,
            color: 'white',
          }}
        >
          Powered by Skoegle Technologies
        </Typography>
      </Fade>
    </Box>
  );
};

export default LoadingScreen;