import React, { FC } from 'react';
import { FormControlLabel, MenuItem, Switch } from '@mui/material';
import { ColumnInstance } from 'react-table';
import { MRT_ColumnInstance } from '..';

interface Props {
  column: MRT_ColumnInstance;
}

export const MRT_ShowHideColumnsMenu: FC<Props> = ({ column }) => {
  const isParentHeader = !!column?.columns?.length;

  const allChildColumnsVisible =
    isParentHeader &&
    !!column.columns?.every((childColumn) => childColumn.isVisible);

  const switchChecked = column.isVisible ?? allChildColumnsVisible;

  const handleToggleColumnHidden = (column: ColumnInstance) => {
    if (isParentHeader) {
      column?.columns?.forEach?.((childColumn) => {
        childColumn.toggleHidden(switchChecked);
      });
    } else {
      column.toggleHidden();
    }
  };

  return (
    <>
      <MenuItem sx={{ pl: `${(column.depth + 0.5) * 2}rem` }}>
        <FormControlLabel
          checked={switchChecked}
          control={<Switch />}
          label={column.Header as string}
          onChange={() => handleToggleColumnHidden(column)}
        />
      </MenuItem>
      {column.columns?.map((c: MRT_ColumnInstance, i) => (
        <MRT_ShowHideColumnsMenu key={`${i}-${c.id}`} column={c} />
      ))}
    </>
  );
};
