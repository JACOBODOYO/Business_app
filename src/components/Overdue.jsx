export default function Overdue(){
    return <>
    <p>Total overdue followups : 781</p>
      <hr className="border-t-2 border-gray-300 my-4" />

      <p>
        Show{" "}
        <select className="border">
          <option value="">10</option>
          <option value="">25</option>
          <option value="">50</option>
          <option value="">100</option>
        </select>{" "}
        entries
      </p>

      <main className="max-w-7xl mx-auto">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4  border-gray-200 rounded-lg h-96">
            <div className="flex flex-row mt-5 ml-5">              <p className="mr-4">Due Today - Followups & tasks</p>
              <p className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Show details in Calendar
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </main>
    </>
}