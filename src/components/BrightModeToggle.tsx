import { IconButton, useColorScheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const BrightModeToggle = () => {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "dark" ? (
        <Brightness4Icon color="primary" />
      ) : (
        <Brightness7Icon color="primary" />
      )}
    </IconButton>
  );
};

export default BrightModeToggle;
