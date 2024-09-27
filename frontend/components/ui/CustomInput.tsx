import {
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authformSchema } from "@/lib/utils"
import { Control, FieldPath, FieldPathValue } from "react-hook-form"
import { z } from "zod"

interface CustomInput {
    control: Control<z.infer<typeof authformSchema>>,
    name: FieldPath<z.infer<typeof authformSchema>>,
    lable: string,
    placeholder: string
}

const CustomInput = ({control, name, lable, placeholder}: CustomInput) => {
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <div className='form-item'>
                <FormLabel className='form-lable'>
                    {lable}
                </FormLabel>
                <div className='flex w-full flex-col'>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            className='input-class'
                            type={name === 'password' ? 'password' : 'text'}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className='form-message mt-2' />
                </div>
            </div>
        )}
    />
  )
}

export default CustomInput