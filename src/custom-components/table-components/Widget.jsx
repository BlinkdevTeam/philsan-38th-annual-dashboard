const Widget = (props) => {
    return(
        <div onClick={() => props.setUserStatus()} className={`rounded-lg flex cursor-pointer py-[5px] px-[20px] gap-[10px] justify-center items-center h-max ${props.userStatus === props.title ? "bg-[#18622f]": "bg-[#acc5b4]"} hover:bg-[#93a99a]`}>
            <div className={`flex gap-[10px] items-center w-[100%] rounded-[8px]`}>
                <p className="text-[#ffffff] text-[12px]">{props.title}</p>
            </div>
            <div className={`flex justify-center rounded-[8px]`}>
                <div className={`${props.color} flex justify-center items-center`}>{props.value.length}</div>
            </div>
        </div>
    )
}

export default Widget;