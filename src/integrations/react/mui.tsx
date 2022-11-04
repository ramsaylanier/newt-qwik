import { qwikify$ } from "@builder.io/qwik-react";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import Add from "@mui/icons-material/Add";
import Share from "@mui/icons-material/Share";
import Delete from "@mui/icons-material/Delete";

// Components
export const MUIDialog = qwikify$(Dialog);
export const MUIIcon = qwikify$(Icon);

// Icons
export const MUIAddIcon = qwikify$(Add);
export const MUIShareIcon = qwikify$(Share);
export const MUIDeleteIcon = qwikify$(Delete);
