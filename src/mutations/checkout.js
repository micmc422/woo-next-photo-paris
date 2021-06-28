import { gql } from "@apollo/client";

const CHECKOUT_MUTATION = gql`
  mutation CHECKOUT_MUTATION($input: CheckoutInput!) {
    checkout(input: $input) {
      result
      redirect
      clientMutationId
      customer {
        hasCalculatedShipping
      }
      order {
        id
        orderKey
        orderNumber
        status
        refunds {
          nodes {
            amount
          }
        }
      }
    }
  }
`;

export default CHECKOUT_MUTATION;
