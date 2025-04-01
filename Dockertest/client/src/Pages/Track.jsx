import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "../Layout/Layout";
import {
  Typography,
  Container,
  Grid,
  TextField,
  Box,
  Paper,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery,
  Chip,
  Tooltip,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Map as MapIcon,
  Explore as ExploreIcon,
  Navigation as NavigationIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon,
  DevicesOther as DeviceIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { useStore } from "../Store/Store";

const LiveGPSTracker = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const mapRef = useRef(null);
  const polylineRefs = useRef({});
  const markerRefs = useRef({});
  const circleMarkerRefs = useRef([]); // To track all circle markers
  
  const [logsData, setLogsData] = useState({});
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { GetRegisterdDevices } = useStore();
  const [devices, setDevices] = useState([]);
  const [latitudelive, setLatitude] = useState(13.003207);
  const [longitudelive, setLongitude] = useState(77.578762);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  
  // Get the current selected device based on the index
  const selectedDevice = devices[selectedDeviceIndex]?.deviceName || "";
  const currentDeviceLabel = devices[selectedDeviceIndex]?.nickname || devices[selectedDeviceIndex]?.deviceName || "No Device";

  const calculateDefaultDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 2);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${day}-${month}-${year}`;
    };
    return formatDate(today);
  };

  const defaultDate = calculateDefaultDate();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(defaultDate);
  const [errorMessage, setErrorMessage] = useState("");

  // Navigation functions
  const goToNextDevice = () => {
    if (selectedDeviceIndex < devices.length - 1) {
      setSelectedDeviceIndex(selectedDeviceIndex + 1);
    } else {
      setSelectedDeviceIndex(0); // Loop back to the first device
    }
  };

  const goToPreviousDevice = () => {
    if (selectedDeviceIndex > 0) {
      setSelectedDeviceIndex(selectedDeviceIndex - 1);
    } else {
      setSelectedDeviceIndex(devices.length - 1); // Loop to the last device
    }
  };

  // Select a specific device by index
  const handleDeviceSelect = (index) => {
    setSelectedDeviceIndex(index);
    clearMapData(); // Make sure to clear map data when selecting a new device
  };
  
  // Clear all map data 
  const clearMapData = () => {
    // Clear existing polylines
    Object.keys(polylineRefs.current).forEach((device) => {
      if (polylineRefs.current[device]) {
        polylineRefs.current[device].remove();
        delete polylineRefs.current[device];
      }
    });

    // Clear existing markers
    Object.keys(markerRefs.current).forEach((device) => {
      if (markerRefs.current[device]) {
        markerRefs.current[device].forEach((marker) => marker.remove());
        delete markerRefs.current[device];
      }
    });
    
    // Clear all circle markers
    circleMarkerRefs.current.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    
    // Reset the array of circle markers
    circleMarkerRefs.current = [];
    
    // If a map instance exists, try to clear all layers as a fail-safe
    if (mapRef.current) {
      // Remove any layers that might not be tracked properly
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.CircleMarker || layer instanceof L.Marker || layer instanceof L.Polyline) {
          // Skip the base tile layer
          if (!layer._url) {
            mapRef.current.removeLayer(layer);
          }
        }
      });
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const devicesData = await GetRegisterdDevices();
        if (devicesData.devices && devicesData.devices.length > 0) {
          setDevices(devicesData.devices);
          setSelectedDeviceIndex(0); // Start with the first device
        } else {
          showSnackbar("No registered devices found. Please register a device.", "warning");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        showSnackbar("Failed to fetch registered devices", "error");
      } finally {
        setLoading(false);
      }
    };

    // Initialize map
    if (!mapRef.current) {
      setMapLoading(true);
      mapRef.current = L.map("map", { zoomControl: false }).setView(
        [latitudelive, longitudelive],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
      
      // Add zoom control to bottom right
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapRef.current);
      
      setMapLoading(false);
    }

    fetchDevices();

    // Cleanup function for map
    return () => {
      clearMapData();
    };
  }, []);

  // Effect to handle device changes
  useEffect(() => {
    if (selectedDevice) {
      // Clear previous device data when selected device changes
      clearMapData();
      
      // Fetch logs for the new device
      fetchLogs();
    }
  }, [selectedDevice, date]);

  const fetchLogs = async () => {
    if (!selectedDevice) return;
    
    setMapLoading(true);
    clearMapData(); // Clear data before fetching new data
    showSnackbar("Fetching logs for " + currentDeviceLabel, "info");

    try {
      const response = await fetch(
        `https://api.skoegle.com/api/find/logs?deviceName=${selectedDevice}&date=${date}`
      );
      const logs = await response.json();
      if (logs && logs.length > 0) {
        const organizedData = logs.map((log) => ({
          lat: log.latitude,
          lng: log.longitude,
          time: log.time,
          date: log.date,
        }));
        
        // Clear existing data first to ensure we only show the current device
        setLogsData({ [selectedDevice]: organizedData });
        renderLogsOnMap({ [selectedDevice]: organizedData });
        showSnackbar("Found " + organizedData.length + " location points", "success");
      } else {
        setLogsData({ [selectedDevice]: [] });
        renderLogsOnMap({ [selectedDevice]: [] });
        showSnackbar("No data found for the selected date and device", "warning");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      showSnackbar("Error fetching logs. Please try again.", "error");
    } finally {
      setMapLoading(false);
    }
  };

  // Render logs on map
  const renderLogsOnMap = (logs) => {
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(year, month - 1, day);

    // Make sure to clear all previous map data
    clearMapData();

    let filteredData = Object.keys(logs).reduce((acc, device) => {
      const deviceLogs = logs[device];
      const filteredDeviceLogs = deviceLogs.filter((log) => {
        const [logDay, logMonth, logYear] = log.date.split("-");
        const logFormattedDate = new Date(logYear, logMonth - 1, logDay);
        return logFormattedDate.toDateString() === formattedDate.toDateString();
      });
      acc[device] = filteredDeviceLogs;
      return acc;
    }, {});

    Object.keys(filteredData).forEach((device) => {
      const routeData = filteredData[device];
      if (routeData.length === 0) return;

      const route = routeData.map((point) => [point.lat, point.lng]);

      polylineRefs.current[device] = L.polyline(route, {
        color: theme.palette.primary.main,
        weight: 3,
        opacity: 0.7,
        lineJoin: 'round'
      }).addTo(mapRef.current);

      // Add small dots for each point in the route - store references to remove later
      route.forEach((point, index) => {
        if (index % 5 === 0 || index === 0 || index === route.length - 1) { 
          // Only show markers at intervals to reduce clutter
          const circleMarker = L.circleMarker(point, { 
            radius: 3, 
            color: theme.palette.secondary.main,
            fillOpacity: 0.7
          }).addTo(mapRef.current);
          
          // Store reference to circle marker for later removal
          circleMarkerRefs.current.push(circleMarker);
        }
      });

      const startIcon = L.icon({
        iconUrl:
          "https://firebasestorage.googleapis.com/v0/b/projects-4f71b.appspot.com/o/red%20blue-location-icon-png-19.png?alt=media&token=dc4aac49-4aaa-4db3-93c4-a2c51c0df152",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const endIcon = L.icon({
        iconUrl:
          "https://firebasestorage.googleapis.com/v0/b/projects-4f71b.appspot.com/o/green%20blue-location-icon-png-19.png?alt=media&token=10185d49-0932-4ba0-b61d-059dc0c14b08",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      if (route.length > 0) {
        // Add start and end markers with popups showing time
        const startPoint = routeData[0];
        const endPoint = routeData[routeData.length - 1];
        
        const startMarker = L.marker(route[0], { icon: startIcon })
          .bindPopup(`<strong>Start</strong><br>Time: ${startPoint.time}<br>Date: ${startPoint.date}`)
          .addTo(mapRef.current);
          
        const endMarker = L.marker(route[route.length - 1], { icon: endIcon })
          .bindPopup(`<strong>End</strong><br>Time: ${endPoint.time}<br>Date: ${endPoint.date}`)
          .addTo(mapRef.current);
        
        markerRefs.current[device] = [startMarker, endMarker];

        // Fit map to show all points
        mapRef.current.fitBounds(polylineRefs.current[device].getBounds(), {
          padding: [50, 50],
          maxZoom: 16
        });
      }
    });
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    const [year, month, day] = value.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    setDate(formattedDate);
    setErrorMessage("");
    clearMapData(); // Clear data when date changes
  };

  const handleViewOnGMaps = () => {
    const route = logsData[selectedDevice] || [];
    if (route.length < 2) {
      showSnackbar("Not enough points to view on Google Maps", "warning");
      return;
    }
    
    const pointsToShare = getPointsToShare(route);
    generateShareUrl(pointsToShare);
  };

  const handleViewOnGraphHopper = () => {
    const route = logsData[selectedDevice] || [];
    if (route.length < 2) {
      showSnackbar("Not enough points to view on GraphHopper", "warning");
      return;
    }
    
    const pointsToShare = getPointsToShare(route);
    generateGraphHopperUrl(pointsToShare);
  };

  const getPointsToShare = (points) => {
    if (points.length <= 20) return points;

    const result = [points[0]]; // Always include first point
    
    // Add evenly spaced points from the middle
    const step = Math.floor((points.length - 2) / 18);
    for (let i = 1; i < points.length - 1; i += step) {
      if (result.length < 19) {
        result.push(points[i]);
      }
    }
    
    result.push(points[points.length - 1]); // Always include last point
    return result;
  };

  const generateShareUrl = (pathPoints) => {
    if (pathPoints.length < 2) {
      showSnackbar("Not enough points to generate a shareable link", "warning");
      return;
    }
    
    const urlBase = "https://www.google.com/maps/dir/";
    const coords = pathPoints.map((point) => `${point.lat},${point.lng}`).join("/");
    const url = `${urlBase}${coords}?entry=ttu`;
    window.open(url, "_blank");
    showSnackbar("Opening route in Google Maps", "success");
  };

  const generateGraphHopperUrl = (pathPoints) => {
    if (pathPoints.length < 2) {
      showSnackbar("Not enough points to generate a GraphHopper link", "warning");
      return;
    }
    
    // Format for GraphHopper: ?point=lat,lng&point=lat,lng&...
    const pointParams = pathPoints
      .map(point => `point=${point.lat}%2C${point.lng}`)
      .join("&");
    
    const url = `https://graphhopper.com/maps/?${pointParams}&profile=car&layer=Omniscale`;
    window.open(url, "_blank");
    showSnackbar("Opening route in GraphHopper", "success");
  };

  // Refresh data handler
  const handleRefresh = () => {
    if (selectedDevice) {
      showSnackbar("Refreshing data...", "info");
      clearMapData(); // Clear before refreshing
      fetchLogs();
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  // Only show first 8 characters for long device names
  const formatDeviceLabel = (label) => {
    if (label.length > 8) {
      return label.substring(0, 8) + '...';
    }
    return label;
  };

  // Current date time and user info
  const getCurrentDateTime = () => {
    return "2025-03-25 06:16:44 - ManojGowda89";
  };

  return (
    <Layout title="Device Path Finder">
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative'
        }}>
          {/* Device Navigation at the top */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          >
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <IconButton 
                  color="primary" 
                  onClick={goToPreviousDevice}
                  disabled={devices.length <= 1}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Grid>
              
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DeviceIcon color="primary" sx={{ mr: 1 }} />
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{ 
                      fontWeight: 'medium',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {currentDeviceLabel || "No Device Selected"}
                  </Typography>
                </Box>
              </Grid>
              
              {!isMobile && (
                <Grid item>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {devices.map((device, index) => (
                      <Chip
                        key={device.deviceCode}
                        label={formatDeviceLabel(device.nickname || device.deviceName)}
                        color={index === selectedDeviceIndex ? "primary" : "default"}
                        variant={index === selectedDeviceIndex ? "filled" : "outlined"}
                        onClick={() => handleDeviceSelect(index)}
                        clickable
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {date.split('-').join('/')}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item>
                <IconButton 
                  color="primary" 
                  onClick={goToNextDevice}
                  disabled={devices.length <= 1}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
          
          <Grid container sx={{ flexGrow: 1 }}>
            {/* Map Container */}
            <Grid item xs={12} md={8} lg={9} sx={{ position: 'relative' }}>
              {mapLoading && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  zIndex: 10, 
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    animation="wave" 
                    width="70%" 
                    height={20} 
                    sx={{ mb: 2, borderRadius: 1 }} 
                  />
                  <Skeleton 
                    variant="rectangular" 
                    animation="wave" 
                    width="50%" 
                    height={20} 
                    sx={{ mb: 2, borderRadius: 1 }} 
                  />
                  <Skeleton 
                    variant="rectangular" 
                    animation="wave" 
                    width="60%" 
                    height={20} 
                    sx={{ borderRadius: 1 }} 
                  />
                </Box>
              )}
              
              <Box 
                id="map" 
                sx={{ 
                  height: { xs: '50vh', md: '70vh' }, 
                  borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
                  borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' }
                }}
              />
              
              {/* Reload Button */}
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 400,
              }}>
                <Tooltip title="Reload Data">
                  <IconButton 
                    color="primary" 
                    onClick={handleRefresh}
                    sx={{ 
                      backgroundColor: 'white', 
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            {/* Controls Container */}
            <Grid item xs={12} md={4} lg={3} sx={{ 
              backgroundColor: theme.palette.background.paper,
              borderBottomRightRadius: '12px'
            }}>
              <Box sx={{ p: 2 }}>
                {loading ? (
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" height={40} width="60%" />
                    <Skeleton variant="rectangular" height={56} sx={{ my: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" height={40} width="80%" />
                    <Skeleton variant="rectangular" height={150} sx={{ my: 2, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      <NavigationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Path Controls
                    </Typography>
                    
                    <TextField
                      label="Select Date"
                      type="date"
                      id="date"
                      value={date.split("-").reverse().join("-")} // Reverse format for input display
                      onChange={handleDateChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      inputProps={{ max: getTodayDate() }} // Set max attribute to today's date
                      size="small"
                    />
                    
                    {isMobile && (
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Select Device:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {devices.map((device, index) => (
                            <Chip
                              key={device.deviceCode}
                              label={formatDeviceLabel(device.nickname || device.deviceName)}
                              color={index === selectedDeviceIndex ? "primary" : "default"}
                              variant={index === selectedDeviceIndex ? "filled" : "outlined"}
                              onClick={() => handleDeviceSelect(index)}
                              size="small"
                              clickable
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Path Statistics
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Total Points:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" fontWeight="medium">
                                {logsData[selectedDevice]?.length || 0}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Date:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" fontWeight="medium">
                                {date}
                              </Typography>
                            </Grid>
                            
                            {logsData[selectedDevice]?.length > 0 && (
                              <>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="textSecondary">
                                    Start Time:
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {logsData[selectedDevice][0]?.time || 'N/A'}
                                  </Typography>
                                </Grid>
                                
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="textSecondary">
                                    End Time:
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {logsData[selectedDevice][logsData[selectedDevice].length-1]?.time || 'N/A'}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={handleViewOnGMaps} 
                      fullWidth
                      startIcon={<MapIcon />}
                      disabled={!logsData[selectedDevice] || logsData[selectedDevice].length < 2}
                      sx={{ mb: 2 }}
                    >
                      View on Google Maps
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={handleViewOnGraphHopper} 
                      fullWidth
                      startIcon={<ExploreIcon />}
                      disabled={!logsData[selectedDevice] || logsData[selectedDevice].length < 2}
                    >
                      View on GraphHopper
                    </Button>
                    
                    <Typography 
                      variant="caption" 
                      color="textSecondary" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'center', 
                        mt: 3,
                        opacity: 0.7
                      }}
                    >
                      {getCurrentDateTime()}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarMessage("")} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default LiveGPSTracker;