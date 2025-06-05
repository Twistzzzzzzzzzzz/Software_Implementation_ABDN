import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Answer_page.css';
import { assets } from '../../../../assets/assets';

export default function Answer_page() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [testType, setTestType] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [questionTimes, setQuestionTimes] = useState([]);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // 响应式设计 - 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 根据路径确定测试类型 - 使用useMemo优化
    useEffect(() => {
        if (location.pathname.includes('anxiety')) {
            setTestType('anxiety');
        } else if (location.pathname.includes('depression')) {
            setTestType('depression');
        } else if (location.pathname.includes('career')) {
            setTestType('career');
        }
        
        // 重置计时器
        setStartTime(Date.now());
    }, [location.pathname]);

    // 当切换到新问题时，重置选中状态和开始计时
    useEffect(() => {
        setSelectedOption(answers[currentQuestionIndex] !== undefined ? answers[currentQuestionIndex] : null);
        setStartTime(Date.now());
    }, [currentQuestionIndex, answers]);

    // 使用useMemo优化问题数据，避免不必要的重复计算
    const { anxietyQuestions, depressionQuestions, careerQuestions } = useMemo(() => ({
        // 焦虑测试问题
        anxietyQuestions: [
            "Do you feel tired about doing anything?",
            "Do you often feel nervous or anxious?",
            "Do you often worry about future events?",
            "Do you often feel short of breath or have a rapid heartbeat?",
            "Do you have difficulty falling asleep or staying asleep?"
        ],

        // 抑郁测试问题
        depressionQuestions: [
            "Do you often feel sad or depressed?",
            "Have you lost interest in activities you used to enjoy?",
            "Do you feel worthless?",
            "Do you have thoughts of self-harm or suicide?",
            "Do you feel lacking energy or exhausted?"
        ],

        // 职业测试问题
        careerQuestions: [
            "Do you like jobs that involve dealing with people?",
            "Do you like creative work?",
            "Do you like working according to rules?",
            "Do you like working independently?",
            "Do you like challenging work?"
        ]
    }), []);

    // 根据测试类型获取问题 - 使用useMemo优化
    const questions = useMemo(() => {
        switch (testType) {
            case 'anxiety':
                return anxietyQuestions;
            case 'depression':
                return depressionQuestions;
            case 'career':
                return careerQuestions;
            default:
                return [];
        }
    }, [testType, anxietyQuestions, depressionQuestions, careerQuestions]);

    const totalQuestions = questions.length;

    // 记录答题时间
    const recordQuestionTime = useCallback(() => {
        const timeSpent = Date.now() - startTime;
        const newQuestionTimes = [...questionTimes];
        newQuestionTimes[currentQuestionIndex] = timeSpent;
        setQuestionTimes(newQuestionTimes);
        return timeSpent;
    }, [currentQuestionIndex, startTime, questionTimes]);

    // 选择答案
    const handleAnswer = useCallback((answer) => {
        setSelectedOption(answer);
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
        
        // 记录本题的回答时间
        recordQuestionTime();
    }, [currentQuestionIndex, answers, recordQuestionTime]);

    // 前进到下一个问题
    const handleNext = useCallback(() => {
        // 如果没有选择答案，不执行任何操作
        if (selectedOption === null) return;

        // 记录当前问题的回答时间
        recordQuestionTime();

        // 如果是最后一个问题，导航到报告页面
        if (currentQuestionIndex === totalQuestions - 1) {
            const score = calculateScore(answers);
            navigate('/self-psycho/report', { 
                state: { 
                    score, 
                    testType,
                    answers,
                    questionTimes,
                    averageTime: questionTimes.reduce((acc, time) => acc + time, 0) / questionTimes.length
                } 
            });
        } else {
            // 否则，前进到下一个问题
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, [
        selectedOption, 
        currentQuestionIndex, 
        totalQuestions, 
        answers, 
        navigate, 
        testType, 
        questionTimes,
        recordQuestionTime
    ]);

    // 使用useCallback优化计算分数函数
    const calculateScore = useCallback((answers) => {
        // 简单计分：选择不同答案得不同分数（0-3分）
        return answers.reduce((total, answer) => total + answer, 0);
    }, []);

    // 动态设置问题标签文本
    const questionLabelText = useMemo(() => {
        return `Question ${currentQuestionIndex + 1}`;
    }, [currentQuestionIndex]);

    // 自适应确定选项布局
    const answerGridStyle = useMemo(() => {
        return screenSize.width < 600 ? { gridTemplateColumns: '1fr' } : {};
    }, [screenSize.width]);

    // 如果没有问题，显示加载中
    if (questions.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="answer-page">
            <img src={assets.Test_answer_bg} alt="Background" className="bg-image" />
            
            <div className="scrollable-content">
                <div className="header">
                    <div className="title-block">
                        <h2 className="test-title">Self Assessment</h2>
                        <p className="question-counter">{currentQuestionIndex + 1} / {totalQuestions}</p>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="content-wrapper">
                    <div className="question-box">
                        <div className="question-label">{questionLabelText}</div>
                        <h3 className="question-text">{questions[currentQuestionIndex]}</h3>
                    </div>
                    
                    <div className="answer-grid" style={answerGridStyle}>
                        <button 
                            className={`answer-option ${selectedOption === 0 ? 'selected' : ''}`} 
                            onClick={() => handleAnswer(0)}
                        >
                            Not at all
                        </button>
                        <button 
                            className={`answer-option ${selectedOption === 1 ? 'selected' : ''}`} 
                            onClick={() => handleAnswer(1)}
                        >
                            Several days
                        </button>
                        <button 
                            className={`answer-option ${selectedOption === 2 ? 'selected' : ''}`} 
                            onClick={() => handleAnswer(2)}
                        >
                            More than half the days
                        </button>
                        <button 
                            className={`answer-option ${selectedOption === 3 ? 'selected' : ''}`} 
                            onClick={() => handleAnswer(3)}
                        >
                            Nearly every day
                        </button>
                    </div>

                    <button 
                        className="next-button" 
                        onClick={handleNext}
                        disabled={selectedOption === null}
                        aria-label="Next question"
                    >
                        Next Question
                    </button>
                </div>
            </div>
        </div>
    );
}

