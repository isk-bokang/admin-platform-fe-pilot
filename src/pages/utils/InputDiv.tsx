import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";




type targProps = { targ: any, setTarg: Dispatch<SetStateAction<any>> }

export function InputTargDiv(prop: targProps) {
    const [keys, setKeys] = useState<string[]>([])

    useEffect(() => {
        let tmpKeys: string[] = []
        tmpKeys = tmpKeys.concat(Object.keys(prop.targ))
        setKeys(tmpKeys)
    }, [prop.targ])

    function onChangeHandle(e: React.ChangeEvent<HTMLTextAreaElement>) {
        prop.targ[e.target.id] = e.target.value
        prop.setTarg(prop.targ)
    }

    return (
        <div>
            <table border={1} style={{ alignItems: "left" }}  >
                <tbody>
                    {
                        keys.map(key => {
                            return (
                                <tr key={key + '_tr'}>
                                    <th id={key + '_th'}>{key}</th>
                                    <td id={key + 'td'} key={key + 'td'}> <textarea id={key} onChange={onChangeHandle} /> </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )

}


type radioProp = { targList: any[], setTarg: Dispatch<SetStateAction<string>> }

export function RadioTargListDiv(prop: radioProp) {
    const [keys, setKeys] = useState<string[]>([])
    const groupNumber = Math.random()
    useEffect(() => {
        let tmpKeys: string[] = []
        setKeys(tmpKeys.concat(Object.keys(prop.targList[0])))

    }, [prop.targList])

    function onChangeHandle(e : ChangeEvent<HTMLInputElement>){
        prop.setTarg(e.target.value)
        
    }


    return (
        <div>
            <table>
                <thead>
                    <th> select </th>
                    {
                        keys.map(key => {
                            return (<th> {key} </th>)
                        })
                    }
                </thead>
                <tbody>
                {
                        prop.targList.map( (val, idx)=>{
                            return <tr >
                                <td id={val}>
                                    <input onChange={onChangeHandle} type="radio" name={`${groupNumber}`} value={`${val.id}`}/>
                                </td>
                                {Object.entries(val).map((entry) =>{
                                    return(
                                        <td> {entry[1] as string} </td>
                                    )
                                })}

                            </tr>
                        } )
                    }
                </tbody>
            </table>
        </div>
    )

}


