export default function UserProfile({params}:any){

    return(
        <div className="flex h-screen w-screen justify-center item-center align-center">
           
            <p className="text-4xl"> profile Page
           <span className=" p-2 rounded bg-orange-500 text-black">{params.id}</span> 
            </p>
        </div>
    );
}