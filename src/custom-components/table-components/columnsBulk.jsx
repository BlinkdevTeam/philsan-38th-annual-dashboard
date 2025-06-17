import { useState, useEffect, useRef } from "react"
import DataTable, { createTheme } from 'react-data-table-component';
import { updateItem } from '../../supabase/supabaseService';

export const columnsBulk = (props) => {        
    const column = [
        {
            name: 'Email',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.email
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
            name: 'Sponsor',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.sponsor
            }),
        },
        {
            name: 'Status',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return row.reg_status
            }),
        },{
            name: 'Upload Status',
            sortable: true,
		    reorder: true,
            selector: (row => {
                return <span className={`${row.upload_failed && "text-[red]"} ${row.upload_failed && "text-[green]"}`}>{row.upload_failed ? row.upload_failed : row.upload_success}</span>
            }),
        },
    ];

    return column;
}

createTheme('philsan', {
    text: {
      primary: '#67706a',
      secondary: '#67706a',
    },
    background: {
      default: '#bfcec4',
    },
    context: {
      background: '#bfcec4',
      text: '#67706a',
    },
    striped: {
        text: '#67706a',
        default: '#acc5b4', // <--- customize this striped row color
      },
    divider: {
      default: '#67706a',
    },
    highlightOnHover: {
        default: '#c2f9d4',
    },
    action: {
      button: '#dbdbdb',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
    pagination: {
        default: "#67706a"
    }
  });


  