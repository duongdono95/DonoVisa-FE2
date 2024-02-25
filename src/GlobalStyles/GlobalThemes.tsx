import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
const callVar = (varName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
};
export const GlobalTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: `${callVar("--primary")}`,
        },
        text: {
          primary: `${callVar("--text")}`,
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: `${callVar("--white")}`,
        },
        background: {
          default: `${callVar("--primary-dark")}`,
        },
        text: {
          primary: `${callVar("--white")}`,
        },
      },
    },
  },
  typography: {
    fontFamily: [callVar("--font-family")].join(","),
  },
  components: {
    //  ------------------------------------FORM LABEL
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 500,
        },
      },
    },
    // // ------------------------------------General buttons
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
    // ------------------------------------Form Select
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: 12,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
        },
      },
    },
    // // ------------------------------------Form Select Dropdown Option
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    // // ------------------------------------Form Input
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: 12,
        },
      },
    },

    //  -------------------------------------------- ToolTip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 12,
          cursor: "pointer",
        },
      },
    },
    // ---------------------------------------Toggle Buttons
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 600,
          padding: 0,
        },
      },
    },
    // ---------------------------------------Avatar/ Avatar Group
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 30,
          height: 30,
          fontSize: 14,
          border: "none !important",
          boxShadow:
            "2px 2px 5px var(--black05), inset 2px 2px 5px var(--black01), inset -2px -2px 5px var(--white05)",
          cursor: "pointer",
          ":hover": {
            transform: "scale(1.1)",
            boxShadow:
              "2px 2px 5px var(--black05), inset -2px -2px 5px var(--black01), inset 2px 2px 5px var(--white05)",
          },
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: {
          gap: "5%",
        },
      },
    },
  },
});
