import React, {useEffect, useState} from "react";
import {ContractApi} from "@/pages/apis/ContractApi";
import {TargListView} from "@/pages/utils/OutputDiv";
import {Button} from "antd";
import {RouteName} from "@/constants";

export interface ListViewContract {
    id: string
    name: string
    contractType?: string
}

export function ContractListDiv() {
    const [contractList, setContractList] = useState<ListViewContract[]>([])

    useEffect(() => {
        ContractApi.getContractList()
            .then(res => {
                setContractList(
                    res.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            contractType: item.contractType.name
                        }
                    })
                )
            })
    }, [])

    return (
        <div>
            {contractList.length !== 0 && <TargListView targList={contractList}/>}
            <Button onClick={() => window.location.href = `${RouteName.REGISTER_CHAIN}`}> REGISTER </Button>
        </div>
    )

}