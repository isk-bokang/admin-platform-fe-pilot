import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type listProps = { targList: any[] }

export function TargListView(prop: listProps) {
    const [keys, setKeys] = useState<string[]>([])

    useEffect(() => {
        let tmpKeys: string[] = []
        setKeys(tmpKeys.concat(Object.keys(prop.targList[0])))
        
    }, [prop.targList])

    return (
        <div>
            <table>
                <thead>
                    {
                        keys.map(key => {
                            return (<th> {key} </th>)
                        })
                    }
                </thead>
                <tbody>
                    {
                        prop.targList.map( (val, idx)=>{
                            return <tr>
                                
                                {Object.entries(val).map((entry) =>{
                                    return(
                                        <td>
                                            <Link to={`${val[keys[0]]}`}>{entry[1] as string}</Link>
                                        </td>
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

type targProps = {targ : any}

export function TargView(prop: targProps){
    const [keys, setKeys] = useState<string[]>([])

    useEffect(() => {
        let tmpKeys: string[] = []
        tmpKeys = tmpKeys.concat(Object.keys(prop.targ))
        setKeys(tmpKeys)
    }, [prop.targ])

    return (
        <div>
            <table border={1} style={{alignItems : "left"} }>{
                keys.map(key => {
                    return (
                        <tr>
                            <th>{key}</th>
                            <td align={"left"}>{prop.targ[key]}</td>
                        </tr>
                )
            } )}
            </table>
        </div>
    )


}

