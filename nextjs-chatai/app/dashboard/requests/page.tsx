export default function CreateIncidence() {

    return (
        <div className="grid grid-cols-1">
            <form>
                <div className="flex flex-col w-2/5 mx-auto my-32 gap-2">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Nombre</label>
                    <input type="text" className="rounded-md flex-grow border border-gray-400 focus:border-red-400"/>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Detalles</label>
                    <textarea className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" id="message"></textarea>
                    <div className="flex justify-end">
                        <button className="ml-4 px-4 rounded-black border-black border rounded-md bg-red-400 text-white hover:bg-red-600 transition-all ease-in-out">Send request</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
