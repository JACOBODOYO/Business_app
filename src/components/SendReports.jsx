export default function SendReports() {
  return (
    <div className="overflow-auto ml-300          h-full p-4">
      <header className="bg-white shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Send reports</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4  border-gray-200 rounded-lg h-96">
            <div className="flex flex-row mt-5 ml-5">
              <p className="mr-4">Due Today - Followups & tasks</p>
              <p className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Show details in Calendar
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
