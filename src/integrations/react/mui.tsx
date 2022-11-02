import { qwikify$ } from "@builder.io/qwik-react";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Add from "@mui/icons-material/Add";
import Share from "@mui/icons-material/Share";

export const MUIIcon = qwikify$(Icon);
export const MUIIconButton = qwikify$(IconButton);
export const MUIButton = qwikify$(Button);
export const MUIDialog = qwikify$(Dialog);

export const MUIAddIcon = qwikify$(Add);
export const MUIShareIcon = qwikify$(Share);
