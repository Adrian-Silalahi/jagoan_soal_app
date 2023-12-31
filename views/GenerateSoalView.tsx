"use client"
import { Grade } from '@/components/grade'
import { Options } from '@/components/options'
import { SubjectChoice } from '@/components/subject'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { mataPelajaran } from '@/lib/mapel'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Session } from 'next-auth'
import toast from 'react-hot-toast'
import LoadingItemQuestion from '@/components/loading/loading-item-question'
import ItemQuestion from '@/components/question/item-question'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'

dayjs.extend(relativeTime)
dayjs.locale('id')

interface Props {
    session: Session | null
}

const GenerateSoalView = ({ session }: Props) => {
    const router = useRouter()
    const [subject, setSubject] = useState<string>("");
    const [grade, setGrade] = useState<string>("umum");
    const [haveOptions, setHaveOptions] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [topic, setTopic] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0)
    const [isInitial, setIsInitial] = useState(true)

    const soalRef = useRef<null | HTMLDivElement>(null);

    const scrollToBios = () => {
        if (soalRef.current !== null) {
            soalRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const onSubmit = async () => {
        if (!session?.user) {
            router.push("/api/auth/signin")
            return;
        }
        if (subject === "") {
            toast.error("Pilih mata pelajaran terlebih dahulu")
            return;
        }
        if (topic === "") {
            toast.error("Masukkan topik soal")
            return;
        }
        if (total === 0) {
            toast.error("Silahkan tentukan jumlah soal")
            return;
        }

        setIsInitial(false)
        await generate();
    }

    const reset = () => {
        setQuestions([])
    }

    const generate = async () => {
        setIsLoading(true)
        reset()

        const data = await fetch("/api/generate-question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                promptSubject: subject,
                promptGrade: grade,
                prompt_have_options: haveOptions,
                promptTopic: topic,
                promptTotal: total,
            }),
        });
        const response = await data.json()
        const questionFromAi = response.data.questions

        if (response === null || response === undefined) {
            console.log(response)

            setIsLoading(false)
            toast.error("Terjadi kesalahan, muat ulang dan coba lagi", { position: 'bottom-center' })
            return;
        }

        try {
            const aiQuestions = questionFromAi
            console.log('aiQuestions', aiQuestions);
            setQuestions(aiQuestions);
        } catch (error) {
            toast("Response sedang melambat, silahkan lakukan generate ulang")
            console.log(error);
        }
        setIsLoading(false)
        scrollToBios();
    };

    return (
        <div className='container mt-10 flex w-full flex-col gap-8 lg:flex-row lg:gap-4'>
            <div className='flex h-auto w-full flex-col lg:w-3/12'>
                <form className="flex w-full flex-col gap-2 rounded-lg">
                    <h1 className='mb-4 inline-flex w-full items-center justify-between border-b border-zinc-50 text-lg font-bold'><span>Filter Generate</span></h1>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="message-2">Mata Pelajaran / Subject</Label>
                        <SubjectChoice disabled={isLoading} onChange={(value) => setSubject(value)} value={subject} />
                    </div>
                    <motion.div
                        className='flex flex-col gap-2'>
                        <Label className='mt-4'>Topik Terkait</Label>
                        <Textarea onChange={(e) => setTopic(e.target.value)} value={topic} disabled={isLoading} placeholder={`Seperti : ${!subject ? "materi pelajaran, kata kunci, dll." : mataPelajaran.find((v) => v.nama === subject)?.subTopik}`} />
                        <span className='text-xs text-zinc-500'>Kamu bisa memasukkan lebih dari satu topik.</span>
                    </motion.div>
                    <motion.div
                        className='flex w-full flex-col justify-between gap-4 sm:flex-row sm:gap-2'>
                        <div className='mt-4 flex w-full flex-col gap-2 sm:w-1/2'>
                            <Label>Tingkatan / Kelas</Label>
                            <Grade disabled={isLoading} onChange={setGrade} value={grade} />
                        </div>
                        <div className='mt-4 flex w-full flex-col gap-2 sm:w-1/2'>
                            <Label>Pilihan Jawaban</Label>
                            <Options disabled={isLoading} onChange={setHaveOptions} haveOptions={haveOptions} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: subject ? 1 : 0, height: subject ? "auto" : 0, display: subject ? "flex" : "none" }}
                        className='flex w-full flex-col justify-between gap-4 sm:flex-row sm:gap-2'>

                        <div className='mt-4 flex w-full flex-col gap-2'>
                            <Label>Jumlah Soal <span className='text-lg font-bold'>--{total}--</span></Label>
                            <Slider disabled={isLoading} defaultValue={[0]} max={10} step={1} onValueChange={(e) => setTotal(e[0])} value={[total]} />
                        </div>
                    </motion.div>
                    <Button
                        className='mt-4 h-14 bg-emerald-500 text-lg hover:bg-emerald-400'
                        size={"lg"}
                        disabled={isLoading}
                        onClick={onSubmit}
                        type="button">
                        {isLoading ? "Sedang Mencari..." : "Generate Soal"}
                    </Button>
                </form>
            </div>
            <div className='flex min-h-screen w-full flex-col gap-4 border-l border-zinc-100 lg:w-9/12 lg:pl-8'>
                {isInitial && <div> Generate soal apapun seperti : </div>}
                {isInitial &&
                    <div className='flex flex-col gap-4'>
                        <span className='cursor-pointer rounded-md border p-4 text-sm hover:bg-zinc-50' onClick={() => { setSubject('Bahasa Inggris'); setTopic('Expression'); setGrade('3 SMP'); setTotal(0) }}><span className='font-bold'>Bahasa Inggris</span>: Expression untuk kelas 3 SMP</span>
                        <span className='cursor-pointer rounded-md border p-4 text-sm hover:bg-zinc-50' onClick={() => { setSubject('IPA'); setTopic('Sistem Pencernaan'); setGrade('3 SMA'); setTotal(0) }}><span className='font-bold'>IPA</span>: Sistem Pencernaan untuk kelas 1 SMA</span>
                        <span className='cursor-pointer rounded-md border p-4 text-sm hover:bg-zinc-50' onClick={() => { setSubject('Matematika'); setTopic('Pecahan'); setGrade('5 SD'); setTotal(0) }}><span className='font-bold'>Matematika</span>: Pecahan untuk kelas 5 SD</span>
                    </div>
                }
                {isLoading && [0, 1, 2, 3, 4].map((item) => (
                    item === 2 ? <div>
                    <div className='text-center text-2xl'>Sedang generate mohon ditunggu...  </div>
                    </div> : <LoadingItemQuestion key={item} />
                ))}
                {questions.map((question, index) => <ItemQuestion key={index} index={index + 1} subject={subject} question={question} />)}
            </div>
        </div >
    )
}

export default GenerateSoalView