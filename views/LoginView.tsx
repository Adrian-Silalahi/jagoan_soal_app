import { SectionButton } from '@/app/login/SectionButton'
const LoginView = () => {
    return (
        <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center rounded-lg border p-4'>
                <h1 className='mb-4 text-xl font-bold'>Masuk Sekarang</h1>
                <SectionButton />
            </div>
        </div>
    )
}

export default LoginView
