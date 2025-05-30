import { useState, useEffect, useRef } from "react"
import DataTable, { createTheme } from 'react-data-table-component';
import { updateItem } from '../../supabase/supabaseService';

export const columns = (props) => {        
    const column = [
        {
            name: 'Email',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.email_address
            }),
        },
        {
            name: 'First Name',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.first_name
            }),
        },
        {
            name: 'Middle Name',
            selector: (row => {
                return row.middle_name
            }),
        },
        {
            name: 'Last Name',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.last_name
            }),
        },
        {
            name: 'Time In',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.time_in ? new Date(row.time_in).toLocaleString() : ''
            }),
        },
        {
            name: 'Time Out',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.time_out ? new Date(row.time_out).toLocaleString() : ''
            }),
        },
    ];

    return column;
}

createTheme('boehringer', {
    text: {
      primary: '#dbdbdb',
      secondary: '#dbdbdb',
    },
    background: {
      default: '#08312a',
    },
    context: {
      background: '#cb4b16',
      text: '#dbdbdb',
    },
    striped: {
        text: '#dbdbdb',
        default: '#093931', // <--- customize this striped row color
      },
    divider: {
      default: '#dbdbdb',
    },
    highlightOnHover: {
        default: '#00e47c',
    },
    action: {
      button: '#dbdbdb',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
    pagination: {
        default: "#dbdbdb"
    }
  });


  