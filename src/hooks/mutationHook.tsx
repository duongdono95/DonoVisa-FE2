import { useMutation } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';
const useMutateHook = (properties: UseMutationOptions) => {
  return useMutation(properties);
};

export default useMutateHook;
