import React, { FC } from 'react';
import {
  TableCell,
  TableSortLabel,
  Divider,
  Collapse,
  Tooltip,
  Box,
  IconButton,
} from '@mui/material';
import { useMRT } from '../useMRT';
import { MRT_FilterTextField } from '../inputs/MRT_FilterTextField';
import { MRT_ToggleColumnActionMenuButton } from '../buttons/MRT_ToggleColumnActionMenuButton';
import { MRT_HeaderGroup } from '..';

export const commonTableHeadCellStyles = (
  densePadding: boolean,
  enableColumnResizing?: boolean,
) => ({
  fontWeight: 'bold',
  height: '100%',
  p: densePadding ? '0.5rem' : '1rem',
  pt: densePadding ? '0.75rem' : '1.25rem',
  transition: `all ${enableColumnResizing ? '10ms' : '0.2s'} ease-in-out`,
  verticalAlign: 'text-top',
});

interface Props {
  column: MRT_HeaderGroup;
}

export const MRT_TableHeadCell: FC<Props> = ({ column }) => {
  const {
    disableColumnActions,
    disableFilters,
    enableColumnResizing,
    icons: { FilterAltIcon, FilterAltOff },
    localization,
    muiTableHeadCellProps,
    setShowFilters,
    tableInstance,
  } = useMRT();

  const isParentHeader = !!column?.columns?.length;

  const mTableHeadCellProps =
    muiTableHeadCellProps instanceof Function
      ? muiTableHeadCellProps(column)
      : muiTableHeadCellProps;

  const mcTableHeadCellProps =
    column.muiTableHeadCellProps instanceof Function
      ? column.muiTableHeadCellProps(column)
      : column.muiTableHeadCellProps;

  const tableCellProps = {
    ...mTableHeadCellProps,
    ...mcTableHeadCellProps,
    ...column.getHeaderProps(),
    style: {
      ...column.getHeaderProps().style,
      ...mTableHeadCellProps?.style,
      ...mcTableHeadCellProps?.style,
    },
  };

  const sortTooltip = column.isSorted
    ? column.isSortedDesc
      ? localization.columnActionMenuItemClearSort
      : localization.columnActionMenuItemSortDesc?.replace(
          '{column}',
          column.Header as string,
        )
    : localization.columnActionMenuItemSortAsc?.replace(
        '{column}',
        column.Header as string,
      );

  const filterTooltip = !!column.filterValue
    ? localization.filterApplied
        .replace('{column}', String(column.Header))
        .replace(
          '{filterType}',
          // @ts-ignore
          localization[
            `filterMenuItem${
              tableInstance.state.currentFilterTypes[column.id]
                .charAt(0)
                .toUpperCase() +
              tableInstance.state.currentFilterTypes[column.id].slice(1)
            }`
          ],
        )
    : localization.toggleFilterButtonTitle;

  const columnHeader = column.render('Header') as string;

  return (
    <TableCell
      align={isParentHeader ? 'center' : 'left'}
      {...tableCellProps}
      sx={{
        ...commonTableHeadCellStyles(
          tableInstance.state.densePadding,
          enableColumnResizing,
        ),
        ...tableCellProps?.sx,
      }}
    >
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          justifyContent: isParentHeader ? 'center' : 'space-between',
          width: '100%',
        }}
      >
        <Box
          {...column.getSortByToggleProps()}
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'nowrap',
            whiteSpace: columnHeader.length < 15 ? 'nowrap' : 'normal',
          }}
          title={undefined}
        >
          {column.render('Header')}
          {!isParentHeader && column.canSort && (
            <Tooltip arrow title={sortTooltip}>
              <TableSortLabel
                aria-label={sortTooltip}
                active={column.isSorted}
                direction={column.isSortedDesc ? 'desc' : 'asc'}
              />
            </Tooltip>
          )}
          {!isParentHeader && !!column.canFilter && (
            <Tooltip arrow title={filterTooltip}>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  setShowFilters(!tableInstance.state.showFilters);
                }}
                size="small"
                sx={{
                  opacity: !!column.filterValue ? 0.8 : 0,
                  p: '2px',
                  m: 0,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                {tableInstance.state.showFilters && !column.filterValue ? (
                  <FilterAltOff fontSize="small" />
                ) : (
                  <FilterAltIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}>
          {!disableColumnActions && !isParentHeader && (
            <MRT_ToggleColumnActionMenuButton column={column} />
          )}
          {enableColumnResizing && !isParentHeader && (
            <Divider
              flexItem
              orientation="vertical"
              onDoubleClick={() => tableInstance.resetResizing()}
              {...column.getResizerProps()}
              sx={{
                borderRightWidth: '2px',
                borderRadius: '2px',
                maxHeight: '2rem',
              }}
            />
          )}
        </Box>
      </Box>
      {!disableFilters && column.canFilter && (
        <Collapse in={tableInstance.state.showFilters}>
          <MRT_FilterTextField column={column} />
        </Collapse>
      )}
    </TableCell>
  );
};
