# Speaker Notes: Academic Self-Introduction for WeLight Lab

Target length: 8-10 minutes  
Style: natural, polite, concise, and discussion-oriented

## Slide 1

Good afternoon, Prof. Peng, Dr. Bai, and everyone. Thank you very much for taking the time to meet with me today.

My name is Shenshi Li, and I am currently a B.Eng. student in Optoelectronic Information Science and Engineering at Zhejiang University. Today I would like to briefly introduce my academic background and several optics-related projects. The main theme is how my recent work connects computational imaging, optical metrology, and 3D reconstruction.

## Slide 2

Here is a quick overview of my background.

I am now studying at the College of Optical Science and Engineering at ZJU, and I expect to graduate in June 2027. My current GPA is 3.94 out of 4.00, ranked 18 out of 103 in my cohort. I received the National Scholarship in 2024, and my TOEFL score is 108.

In terms of research preparation, I would summarize myself in three parts. First, I have optical-system training, including Zemax lens design and microscope-related projects. Second, I have worked on imaging and vision algorithms, especially depth-from-focus reconstruction and OpenCV-based measurement software. Third, I care a lot about reproducible research software, because I think good experiments also need reliable pipelines, figures, and documentation.

## Slide 3

This slide shows my project trajectory.

My earlier research training started from proposal writing, literature review, and poster preparation. After that, I joined a LEGO-based fluorescence microscope project, where I worked more on mechanical structure and optical-path design.

In 2025, my projects became more focused on optical measurement and computational reconstruction. For the micro-hole metrology project, I worked on a confocal microscopy-based measurement idea and built OpenCV measurement software. For the DFF surface defect project, I led a student research training project on focus-stack imaging, depth-from-focus reconstruction, and heterogeneous-material defect detection. I also participated in a Zemax-based mirrorless camera lens design project.

So overall, my experience has gradually moved toward the boundary between optical capture, physical constraints, and computational reconstruction.

## Slide 4

The main project I would like to introduce is heterogeneous-surface defect detection.

The motivation is that for surfaces such as metal, ceramic, and polymer, defect detection can be difficult from a single image. Metal surfaces may have strong specular glare. Ceramic surfaces may have grain texture. Polymer defects can be low-contrast. These visual factors can interfere with defect cues.

So in this project, we considered focus-stack imaging and depth-from-focus reconstruction. The idea is that instead of only looking at one image, we can use focus changes along the axial direction to estimate relative surface depth. Then this depth cue can be combined with visual analysis and learning-based correction for defect visualization.

## Slide 5

This is the main DFF pipeline.

We start from focus-stack acquisition, where images are captured or simulated at different z positions. Then we compute a focus measure for each local region, which gives a sharpness score. Based on the best-focus index, we estimate a relative depth map.

After that, we consider glare-aware evaluation, because reflective regions can disturb focus measures. Finally, we use learning-based correction and visualization to make the defect-related surface information easier to inspect.

The lower part of the slide shows some representative panels from my project materials, including synthetic comparison figures, surface reconstruction results, and real-sample relative reconstruction.

## Slide 6

My main contribution was building the reproducible pipeline and organizing the evidence boundary clearly.

For the simulated part, I built the Python pipeline for synthetic surface generation, focus-stack simulation, DFF reconstruction, and comparison figure generation. This part is useful for controlled algorithm comparison because we can define the surface information more explicitly.

For real samples, I treated the results more carefully as relative reconstruction and visual evidence, because real ground truth is not always available. I tried to avoid overclaiming quantitative accuracy when the data does not support it.

I also implemented the project-wide height convention and ran comparisons between traditional and learning-based methods. This project trained me to think about both the optical imaging process and the computational reconstruction pipeline.

## Slide 7

Another optics-related project is nondestructive measurement of high-aspect-ratio micro-holes.

The background is that micro-holes are important in areas such as microelectronics and microfluidics, but their depth and aperture can be difficult to measure nondestructively. Our proposed idea was based on confocal tomographic scanning, so that top and bottom surface information could be acquired without contact.

My own work focused on the measurement software. I built an OpenCV-based tool using Hough circle detection and least-squares fitting. It supports both automatic detection and manual fitting, because in real images the boundary can be noisy or incomplete.

This project helped me understand that optical metrology is not only about a physical measurement principle. It also requires robust software that can handle imperfect images and real user interaction.

## Slide 8

I also had several optical engineering experiences beyond image processing.

For the mirrorless camera lens design project, I worked with Zemax on structure optimization and performance analysis. The tasks included MTF evaluation, athermal analysis, ghost-image review, cost and tolerance analysis, lens-barrel assembly planning, and Monte Carlo validation.

For the LEGO-based fluorescence microscope, I designed mechanical modules using LEGO Studio and collaborated on optical-path design in Zemax. The project eventually delivered a working fluorescence microscope prototype.

These projects were useful because they gave me a more system-level view of optics: not only algorithms, but also optical layout, tolerance, assembly, and prototype constraints.

## Slide 9

Here is my technical toolkit.

For imaging reconstruction, I mainly use Python, OpenCV, and PyTorch. For measurement software, I have used OpenCV, Tkinter, Hough circle detection, and least-squares fitting. For optical design, I have experience with Zemax, SolidWorks, and AutoCAD. I also use LaTeX, Markdown, and Office tools for reports and documentation.

I think my current strength is that I am comfortable moving between optical-system constraints, reconstruction algorithms, and implementation details. I am still early in research, but I have tried to build projects in a way that is reproducible and inspectable.

## Slide 10

This is why I am especially interested in WeLight Lab.

From my understanding, the lab works at the intersection of computational optics, imaging, display, holography, 3D vision, graphics, and AI. These directions are very attractive to me because they require both optical-system understanding and computational modeling.

On my side, my preparation includes optical imaging intuition, DFF and 3D reconstruction practice, and implementation experience with OpenCV, PyTorch, and Zemax. The overlap I hope to develop further is computational imaging, coded or learned optics, 3D reconstruction, low-level vision, and experimental constraints.

So I see this meeting as a chance to learn whether my current preparation could fit your group’s research directions, and what I should strengthen next.

## Slide 11

Looking forward, I have three questions that I am especially interested in.

First, how can focus and defocus cues be integrated with learned optics for more robust 3D perception? This question comes directly from my DFF project.

Second, how can physical priors improve reconstruction on reflective or heterogeneous surfaces? In my current project, material texture and glare are still challenging.

Third, what experimental calibration and data-acquisition habits are essential for optics-AI systems? I think this is very important, because a model can only be useful when the experimental data is trustworthy.

These are not fixed research proposals yet. They are more like directions where I hope to receive feedback and learn from your group.

## Slide 12

To conclude, my current background is in optical engineering, computational imaging, and research software. I hope to grow toward optics-vision-AI co-design, especially for computational imaging and 3D vision systems.

Thank you again for your time. I would be very grateful for any feedback on whether my preparation fits current PhD, RA, or visiting research directions in your group. I am also happy to share my transcript, project reports, source code, or more detailed result figures after the meeting.

Thank you.

## If Asked About Backup Slides

For the backup slides, I prepared more details on the DFF comparison, the micro-hole measurement workflow, lens design evidence, and selected coursework and links. I can go through any of these if they are useful for the discussion.
