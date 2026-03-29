import { Send } from "lucide-react"

export default function SendButton({ onClick }){

    return( 
        <div>

         <div className="flex flex-col items-center">
           <button
           onClick={onClick}
           className="mt-4 hover:text-blue-600"
           >
            <Send size={14}/>
           </button>

           <p className="mt-[2px] font-semibold text-[12px] hover:text-blue-600">
            Share
           </p>

         </div>

        </div>
    )
}