import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloseIcon from "@mui/icons-material/Close";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import OBR from "@owlbear-rodeo/sdk";

import { InitiativeItem } from "../components/InitiativeItem";
import { Checkbox, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { getPluginId } from "../helpers/getPluginId";
import TokenImage from "../components/TokenImage";
import { focusItem } from "../helpers/findItem";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "../tailwind.css";
import { cn } from "../helpers/utils";

export function InitiativeListItem({
  item,
  onReadyChange,
  showHidden: roleIsGm,
  edit,
  selected,
}: {
  item: InitiativeItem;
  onReadyChange: (ready: boolean) => void;
  showHidden: boolean;
  edit: boolean;
  selected: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  if (!item.visible && !roleIsGm) {
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFocus = (event: any) => {
    event.target.select();
  };

  const iconDim =
    (item.group === 1 && !roleIsGm) || (!item.active && !item.ready);

  return (
    <ListItem
      ref={setNodeRef}
      style={{ ...style, cursor: "pointer" }}
      {...attributes}
      key={item.id}
      secondaryAction={
        <>
          {edit ? (
            <button
              style={{ touchAction: "none" }}
              {...listeners}
              className="flex size-[42px] items-center justify-center bg-transparent"
            >
              <DragIndicatorIcon />
            </button>
          ) : (
            <Checkbox
              checkedIcon={
                <FlagRoundedIcon style={{ opacity: iconDim ? 0.5 : 1 }} />
              }
              icon={
                <OutlinedFlagRoundedIcon
                  style={{ opacity: iconDim ? 0.5 : 1 }}
                />
              }
              checked={item.ready}
              onFocus={(evt) => {
                handleFocus(evt);
              }}
              value={item.count}
              onChange={(e) => onReadyChange(e.target.checked)}
              onDoubleClick={(e) => e.stopPropagation()}
            />
          )}
        </>
      }
      divider
      selected={item.active}
      sx={{
        padding: 1,
        pl: "12px",
        pr: "64px",
      }}
      onDoubleClick={() => focusItem(item.id)}
    >
      <Box
        component={"div"}
        className={cn("grid grid-cols-[30px_1fr] items-center gap-2", {
          "grid-cols-[30px_20px_1fr]": !item.visible && roleIsGm,
        })}
      >
        <IconButton
          sx={{ paddingX: 0, paddingY: 0, height: 30, width: 30 }}
          onClick={() => removeFromInitiative(item.id)}
          tabIndex={-1}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <div className="group grid place-items-center">
            <div className="col-start-1 row-start-1 group-hover:opacity-0">
              <TokenImage src={item.url} outline={selected} />
            </div>
            <CloseIcon
              className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100"
              sx={{ height: 30, width: 30 }}
            />
          </div>
        </IconButton>

        {!item.visible && roleIsGm && (
          <ListItemIcon sx={{ minWidth: "20px", opacity: "0.5" }}>
            <VisibilityOffRounded fontSize="small" />
          </ListItemIcon>
        )}
        <Box
          component="div"
          sx={{
            color: !item.visible && roleIsGm ? "text.disabled" : "text.primary",
            pb: "2px",
          }}
        >
          {item.name}
        </Box>
      </Box>
    </ListItem>
  );
}

function removeFromInitiative(itemId: string) {
  OBR.scene.items.getItems([itemId]).then((items) => {
    OBR.scene.items.updateItems(items, (items) => {
      for (const item of items) {
        delete item.metadata[getPluginId("metadata")];
      }
    });
  });
}
