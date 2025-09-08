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
            cell: (row) => {
                const statusText = row.upload_failed ? row.upload_failed : row.upload_success;
                const colorClass = row.upload_failed ? "text-red-500" : "text-green-500";

                return (
                <div className="relative group max-w-[150px]">
                    {/* Truncated text */}
                    <span
                    className={`${colorClass} block truncate cursor-pointer`}
                    >
                    {statusText}
                    </span>

                    {/* Custom tooltip */}
                    <div className="absolute hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded-lg -top-10 left-0 whitespace-normal z-50 shadow-lg max-w-[300px]">
                    {statusText}
                    </div>
                </div>
                );
            },
        }


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


  