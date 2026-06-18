import { alpha, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#111111',
      secondary: '#6F6F6F'
    },
    primary: {
      main: '#111111',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#245B4E'
    },
    divider: 'rgba(17, 17, 17, 0.12)'
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.06em',
      lineHeight: 0.92,
      fontSize: 'clamp(3rem, 6vw, 5.75rem)'
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.05em',
      lineHeight: 0.98,
      fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)'
    },
    h3: {
      fontWeight: 750,
      letterSpacing: '-0.04em',
      lineHeight: 1.05,
      fontSize: 'clamp(1.75rem, 3vw, 2.75rem)'
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.1
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15
    },
    h6: {
      fontWeight: 650,
      letterSpacing: '-0.015em',
      lineHeight: 1.2
    },
    body1: {
      lineHeight: 1.65
    },
    body2: {
      lineHeight: 1.6
    },
    overline: {
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          minHeight: '100%'
        },
        body: {
          minHeight: '100%',
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
          color: '#111111',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },
        '#root': {
          minHeight: '100%'
        },
        '*::selection': {
          backgroundColor: alpha('#245B4E', 0.16)
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111111',
          backgroundImage: 'none',
          borderBottom: 'none',
          backdropFilter: 'blur(18px)'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 76
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          paddingBlock: 10
        },
        sizeSmall: {
          paddingInline: 14,
          paddingBlock: 8
        },
        contained: {
          backgroundColor: '#111111',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#000000'
          }
        },
        outlined: {
          borderColor: 'rgba(17, 17, 17, 0.16)',
          backgroundColor: alpha('#FFFFFF', 0.72),
          '&:hover': {
            borderColor: 'rgba(17, 17, 17, 0.28)',
            backgroundColor: '#FFFFFF'
          }
        },
        text: {
          paddingInline: 14,
          color: '#111111'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(17, 17, 17, 0.12)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        rounded: {
          borderRadius: 28
        },
        outlined: {
          borderColor: 'rgba(17, 17, 17, 0.12)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: alpha('#FFFFFF', 0.72),
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(17, 17, 17, 0.28)'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#111111',
            borderWidth: 1
          }
        },
        notchedOutline: {
          borderColor: 'rgba(17, 17, 17, 0.12)'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#6F6F6F'
        }
      }
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          color: 'rgba(17, 17, 17, 0.42)',
          '&.Mui-checked': {
            color: '#245B4E'
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: 'rgba(17, 17, 17, 0.08)'
        },
        bar: {
          borderRadius: 999,
          backgroundColor: '#111111'
        }
      }
    }
  }
});
