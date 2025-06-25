import { TextInput } from "../../components";


function AnnouncementsPage() {
    return (
        <div>
            <h1>Announcements</h1>
            <p>Welcome to the Announcements page!</p>

            <div className="flex flex-col gap-4">
                <TextInput
                    label="Title"
                    placeholder="Make a title for your announcement"
                />
                <textarea
                    rows="4"
                    name="announcement_description"
                    className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your announcement here"
                />
            </div>
        </div>
    );
}

export default AnnouncementsPage;