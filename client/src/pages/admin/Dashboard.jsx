import { ReusableTable, ReusableDropdown } from '../../components';
import React from 'react';
import { NumberPane } from '../../components';

export default function Dashboard() {
  // Sample data for the table
  const mockData = {
    "tableHeading": [
      {
        "key": "RSO_name",
        "name": "RSO Name"
      },
      {
        "key": "documents_sent",
        "name": "Documents Sent"
      }
    ],
    "tableRow": [
      {
        "id": 1,
        "RSO_name": "Computer Science Club",
        "documents_sent": 15,
        "RSO_College": "College of Engineering",
        "picture": ""
      },
      {
        "id": 2,
        "RSO_name": "Biology Students Association",
        "documents_sent": 8,
        "RSO_College": "College of Science",
        "picture": "https://example.com/bio-club.jpg"
      },
      {
        "id": 3,
        "RSO_name": "Business Leaders Forum",
        "documents_sent": 12,
        "RSO_College": "Business School",
        "picture": ""
      },
      {
        "id": 4,
        "RSO_name": "Art and Design Society",
        "documents_sent": 5,
        "RSO_College": "College of Arts",
        "picture": "https://example.com/art-club.jpg"
      },
      {
        "id": 5,
        "RSO_name": "Engineering Student Council",
        "documents_sent": 20,
        "RSO_College": "College of Engineering",
        "picture": ""
      },
      {
        "id": 6,
        "RSO_name": "Mathematics Club",
        "documents_sent": 7,
        "RSO_College": "College of Science",
        "picture": "https://example.com/math-club.jpg"
      },
      {
        "id": 7,
        "RSO_name": "Psychology Association",
        "documents_sent": 9,
        "RSO_College": "College of Social Sciences",
        "picture": ""
      },
      {
        "id": 8,
        "RSO_name": "Environmental Awareness Group",
        "documents_sent": 14,
        "RSO_College": "College of Environmental Studies",
        "picture": "https://example.com/eco-club.jpg"
      },
      {
        "id": 9,
        "RSO_name": "Debate Society",
        "documents_sent": 11,
        "RSO_College": "College of Humanities",
        "picture": ""
      },
      {
        "id": 10,
        "RSO_name": "Music Enthusiasts Club",
        "documents_sent": 6,
        "RSO_College": "College of Arts",
        "picture": "https://example.com/music-club.jpg"
      },
      {
        "id": 11,
        "RSO_name": "Music Enthusiasts Club1",
        "documents_sent": 6,
        "RSO_College": "College of Arts",
        "picture": "https://example.com/music-club.jpg"
      }
    ]
  }

  // Sample data for the table
  const mockUserData = {
    "tableHeading": [
      {
        "key": "user_name",
        "name": "User Name"
      },
      {
        "key": "status",
        "name": "User Status"
      }
    ],
    "tableRow": [
      {
        "id": 1,
        "user_name": "John Smith",
        "status": "Approved",
      },
      {
        "id": 2,
        "user_name": "Emma Johnson",
        "status": "Pending",
      },
      {
        "id": 3,
        "user_name": "Michael Brown",
        "status": "Rejected",
      },
      {
        "id": 4,
        "user_name": "Sophia Williams",
        "status": "Approved",
      },
      {
        "id": 5,
        "user_name": "Robert Jones",
        "status": "Pending",
      }
    ]
  }

  const documentOptions = [
    "All",
    "Pending Documents",
    "Approved Documents",
    "Rejected Documents",
  ]

  const accountOptions = [
    "All",
    "Pending Accounts",
    "Approved Accounts",
    "Rejected Accounts",
  ]

  return (
    <>
      <div className="border border-mid-gray bg-white rounded-lg p-4 mt-4">
        {/* Pending documents from RSOs */}
        <label htmlFor="documentsTable"></label>

        <div className='flex flex-col md:flex-row items-center justify-start gap-4'>
          <NumberPane title="Document End Date" number={30} />
          <NumberPane title="Total RSOs" number={5} />
          <NumberPane title="Total Users" number={100} />
        </div>

        <div className='grid grid-cols-1  md:grid-cols-2 gap-4 mt-8 w-full'>
          <div className='flex flex-col '>
            <div className='flex items-center justify-between w-full mb-4'>
              <h1 className='font-bold'>Documents</h1>
              <ReusableDropdown
                options={documentOptions}
                showAllOption={false}
                value={null}
              ></ReusableDropdown>
            </div>
            <ReusableTable
              showFilters={false}
              columnNumber={2}
              tableHeading={mockData.tableHeading}
              tableRow={mockData.tableRow}
              placeholder="Search RSOs..."
              onClick={(row) => console.log("Row clicked:", row)}
              isLoading={false}
              error={null}
            />
          </div>

          <div className='flex flex-col '>
            <div className='flex items-center justify-between w-full mb-4'>
              <h1 className='font-bold'>Accounts</h1>
              <ReusableDropdown
                options={accountOptions}
                showAllOption={false}
                value={null}
              ></ReusableDropdown>
            </div>
            <ReusableTable
              showFilters={false}
              columnNumber={2}
              tableHeading={mockUserData.tableHeading}
              tableRow={mockUserData.tableRow}
              placeholder="Search RSOs..."
              onClick={(row) => console.log("Row clicked:", row)}
              isLoading={false}
              error={null}
            />
          </div>


        </div>
      </div>
    </>
  );
}
