import { useEffect } from "react";

import AddTransaction from "../AddTransaction/AddTransaction";
import SideBar from "../SideBar/SideBar";
import BarCharts from "../BarCharts/BarCharts";
import { TailSpin } from "react-loader-spinner";
import EachTransaction from "../EachTransaction/EachTransaction";
import useUserId from "../../hooks/useUserId";
import useFetch from "../../hooks/useFetch";
import { useStore } from "../../context/storeContext";
import { useMachine } from "@xstate/react";
import { apiMachine } from "../../machines/apiMachine";
import "./index.css";
import { observer } from "mobx-react";
import { sortedData } from "../../utils/SortedData";
import { updateTransactionData } from "../../utils/UpdatedTransactionData";
import TransactionModel from "../../store/Models/TransactionModel";

interface ResponseData {
  id: number;
  transaction_name: string;
  type: string;
  category: string;
  amount: number;
  date: Date | string;
  user_id: string | undefined;
}

interface Response {
  transactions: Array<ResponseData>;
}

const Home = () => {
  const transactionStore = useStore();
  const userId = useUserId();

  const urlOfRecentThreeTr =
    "https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=100&offset=0";
  const accesToken =
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF";
  const userOrAdmin = userId === "3" ? "admin" : "user";
  const options = {
    method: "GET",
    headers: {
      "x-hasura-admin-secret": accesToken,
      "Content-Type": "application/json",
      "x-hasura-role": userOrAdmin,
      "x-hasura-user-id": userId,
    },
  };
  const { fetchData } = useFetch(urlOfRecentThreeTr, options);

  const [state, send] = useMachine(apiMachine, {
    services: {
      FETCH_DATA: async (context, event) => {
        const data = await fetchData();
        return data;
      },
    },
  });
  useEffect(() => {
    send({
      type: "FETCH",
    });
  }, []);

  useEffect(() => {
    getRecentThreeTransactions();
  }, [state.value, state.context.data]);

  const getRecentThreeTransactions = () => {
    const response = state.context.data as Response | null;
    if (response !== null) {
      const sortedata = sortedData(response);
      const updateData = updateTransactionData(sortedata);
      const listOfTrns = updateData.map((each) => {
        let obj = new TransactionModel(each);
        return obj;
      });
      transactionStore.setTransactionList(listOfTrns);
    }
  };

  const deleteTransaction = async (id: number) => {
    const url =
      " https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
    const deleteTransactionId = {
      id,
    };
    const options: object = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": userId,
      },
      body: JSON.stringify(deleteTransactionId),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      transactionStore.deleteTransaction(id);
    }
  };

  const renderSuccessView = () => {
    const threeTransactions = transactionStore.transactionsList.slice(0, 3);
    return (
      <ul className="last-transactions-container">
        {threeTransactions.map((eachTransaction) => (
          <EachTransaction
            key={eachTransaction.id}
            deleteTransaction={deleteTransaction}
            transactionDetails={eachTransaction}
          />
        ))}
      </ul>
    );
  };

  const onClickRetry = () => {
    getRecentThreeTransactions();
  };

  const renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/daflxmokq/image/upload/v1677128965/alert-triangle_yavvbl.png"
        alt="failure view"
        className="failure view"
      />
      <p className="alert-msg">Something went wrong. Please try again</p>
      <button
        className="tryagain-btn cursor-pointer"
        type="button"
        onClick={onClickRetry}
      >
        Try again
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container">
      <TailSpin color="#4094EF" height={50} width={50} />
    </div>
  );

  const renderOnApiStatus = () => {
    switch (true) {
      case state.matches("success"):
        return renderSuccessView();
      case state.matches("error"):
        return renderFailureView();
      case state.matches("loading"):
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <SideBar activeTab="dashboard" />
      <div className="home-container">
        <div className="heading-container">
          <h1 className="accounts-heading">Accounts</h1>
          <AddTransaction />
        </div>
        <div className="accounts-container">
          <div className="credit-debit-container">
            <div className="credit-container">
              <div className="amount-credit-container">
                <h1 className="credit-amount">${transactionStore.creditSum}</h1>
                <p className="credit-name">Credit</p>
              </div>
              <img
                className="credit-img"
                src="https://res.cloudinary.com/daflxmokq/image/upload/v1690631804/Group_1_dcvrzx.jpg"
                alt="credit"
              />
            </div>
            <div className="credit-container">
              <div className="amount-credit-container">
                <h1 className="debit-amount">${transactionStore.debitSum}</h1>
                <p className="credit-name">Debit</p>
              </div>
              <img
                src="https://res.cloudinary.com/daflxmokq/image/upload/v1690631794/Group_2_klo0rc.jpg"
                alt="debit"
              />
            </div>
          </div>
          <h2 className="last-transaction-heading">Last Transaction</h2>
          {renderOnApiStatus()}
          <h2 className="debit-credit-overview-name">
            Debit & Credit Overview
          </h2>
          <BarCharts />
        </div>
      </div>
    </div>
  );
};
export default observer(Home);
