import { useEffect } from "react"
import emailVerify from '../.../../../../../assets/emailVerify-logo.svg'


interface EmailAlertProps {
  onClose:()=>void
}

export const EmailAlert:React.FC<EmailAlertProps>=({onClose})=>{

  useEffect(()=>{
    const timer = setTimeout(()=>{
      onClose();
    },4000)
  },[onClose])

  return(
    <div className="fixed flex items-center justify-center inset-0 z-50 bg-black bg-opacity-30">
      <div className="text-black rounded-md flex flex-col gap-y-10 items-center py-9 px-5 md:w-[40%] h-[50%] shadow-2xl bg-white">
        <img src={emailVerify} alt="" className="h-full" />
        <h1 className="text-lg md:text-2xl font-bold">Let's get your email verified to get started.</h1>
      </div>
    </div>
  )
}

